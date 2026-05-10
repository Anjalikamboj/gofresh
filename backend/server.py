from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import List, Optional
from pydantic import EmailStr
import logging

from models import (
    Product, ProductCreate, ProductUpdate,
    Subscription, SubscriptionCreate, SubscriptionUpdate,
    Order, User, UserCreate, UserLogin, Token, UserUpdate
)
from database import get_database, close_database
from scheduler import start_scheduler, shutdown_scheduler, run_order_generation_job
from auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user, get_current_admin, ACCESS_TOKEN_EXPIRE_MINUTES
)
from bson import ObjectId

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting GroFresh backend...")
    get_database()
    start_scheduler()
    yield
    # Shutdown
    shutdown_scheduler()
    close_database()
    logger.info("Shutdown complete")


app = FastAPI(title="GroFresh API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def serialize_doc(doc):
    """Convert MongoDB document to JSON-serializable format"""
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize_doc(item) for item in doc]
    if isinstance(doc, dict):
        result = {}
        for key, value in doc.items():
            if key == "_id":
                result["id"] = str(value)
            elif key == "hashed_password":
                # Never return hashed password
                continue
            elif isinstance(value, ObjectId):
                result[key] = str(value)
            elif isinstance(value, datetime):
                result[key] = value.isoformat()
            elif isinstance(value, dict):
                result[key] = serialize_doc(value)
            elif isinstance(value, list):
                result[key] = serialize_doc(value)
            else:
                result[key] = value
        return result
    return doc


# ========== AUTH ENDPOINTS ==========

@app.post("/api/auth/register", response_model=dict)
async def register(user: UserCreate):
    """Register a new user"""
    db = get_database()
    
    # Check if user already exists
    existing_user = db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    user_dict = {
        "email": user.email,
        "full_name": user.full_name,
        "hashed_password": hashed_password,
        "role": "user",
        "created_at": datetime.now()
    }
    
    result = db.users.insert_one(user_dict)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": str(result.inserted_id), "role": "user"},
        expires_delta=access_token_expires
    )
    
    created_user = db.users.find_one({"_id": result.inserted_id})
    
    return {
        "user": serialize_doc(created_user),
        "access_token": access_token,
        "token_type": "bearer"
    }


@app.post("/api/auth/login", response_model=dict)
async def login(credentials: UserLogin):
    """Login user"""
    db = get_database()
    
    # Find user
    user = db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "user_id": str(user["_id"]), "role": user.get("role", "user")},
        expires_delta=access_token_expires
    )
    
    return {
        "user": serialize_doc(user),
        "access_token": access_token,
        "token_type": "bearer"
    }


@app.get("/api/auth/me", response_model=dict)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user info"""
    db = get_database()
    user = db.users.find_one({"_id": ObjectId(current_user["user_id"])})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return serialize_doc(user)


@app.patch("/api/auth/profile", response_model=dict)
async def update_profile(
    update_data: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update user profile"""
    db = get_database()
    user = db.users.find_one({"_id": ObjectId(current_user["user_id"])})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    updates = {}
    
    # Update full name
    if update_data.full_name is not None:
        updates["full_name"] = update_data.full_name
    
    # Update email (check if not already taken)
    if update_data.email is not None and update_data.email != user["email"]:
        existing = db.users.find_one({"email": update_data.email})
        if existing:
            raise HTTPException(status_code=400, detail="Email already in use")
        updates["email"] = update_data.email
    
    # Update password (requires current password verification)
    if update_data.new_password is not None:
        if not update_data.current_password:
            raise HTTPException(status_code=400, detail="Current password required to set new password")
        
        if not verify_password(update_data.current_password, user["hashed_password"]):
            raise HTTPException(status_code=401, detail="Current password is incorrect")
        
        if len(update_data.new_password) < 6:
            raise HTTPException(status_code=400, detail="New password must be at least 6 characters")
        
        updates["hashed_password"] = get_password_hash(update_data.new_password)
    
    if not updates:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    # Update user
    db.users.update_one(
        {"_id": ObjectId(current_user["user_id"])},
        {"$set": updates}
    )
    
    # Return updated user
    updated_user = db.users.find_one({"_id": ObjectId(current_user["user_id"])})
    return serialize_doc(updated_user)



# ========== ADMIN USER MANAGEMENT ==========

@app.get("/api/admin/users", response_model=dict)
async def get_all_users(
    page: int = 1,
    page_size: int = 10,
    current_user: dict = Depends(get_current_admin)
):
    """Get paginated list of all users (Admin only)"""
    db = get_database()
    
    # Validate pagination parameters
    if page < 1:
        page = 1
    if page_size < 1 or page_size > 100:
        page_size = 10
    
    # Calculate skip
    skip = (page - 1) * page_size
    
    # Get total count
    total = db.users.count_documents({})
    
    # Get paginated users
    users = list(
        db.users.find({})
        .sort("created_at", -1)  # Newest first
        .skip(skip)
        .limit(page_size)
    )
    
    # Calculate total pages
    total_pages = (total + page_size - 1) // page_size
    
    return {
        "items": serialize_doc(users),
        "page": page,
        "page_size": page_size,
        "total": total,
        "total_pages": total_pages
    }



# ========== PRODUCT ENDPOINTS ==========

@app.get("/api/products", response_model=List[dict])
async def list_products():
    """Get all products"""
    db = get_database()
    products = list(db.products.find({}))
    return serialize_doc(products)


@app.get("/api/products/{product_id}", response_model=dict)
async def get_product(product_id: str):
    """Get a specific product"""
    db = get_database()
    product = db.products.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return serialize_doc(product)


@app.post("/api/products", response_model=dict)
async def create_product(product: ProductCreate, current_user: dict = Depends(get_current_admin)):
    """Create a new product (Admin only)"""
    db = get_database()
    product_dict = product.model_dump()
    product_dict['created_at'] = datetime.now()
    
    try:
        result = db.products.insert_one(product_dict)
        created_product = db.products.find_one({"_id": result.inserted_id})
        return serialize_doc(created_product)
    except Exception as e:
        if "duplicate key" in str(e):
            raise HTTPException(status_code=400, detail="Product SKU already exists")
        raise HTTPException(status_code=500, detail=str(e))


@app.patch("/api/products/{product_id}", response_model=dict)
async def update_product_stock(product_id: str, update: ProductUpdate, current_user: dict = Depends(get_current_admin)):
    """Update product stock (Admin only)"""
    db = get_database()
    result = db.products.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": {"stock_on_hand": update.stock_on_hand}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    updated_product = db.products.find_one({"_id": ObjectId(product_id)})
    return serialize_doc(updated_product)



@app.delete("/api/products/{product_id}", response_model=dict)
async def delete_product(product_id: str, current_user: dict = Depends(get_current_admin)):
    """Delete a product (Admin only)"""
    db = get_database()
    
    # Check if product exists
    product = db.products.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if product is used in any active subscriptions
    active_subscriptions = db.subscriptions.count_documents({
        "items.product_id": product_id,
        "status": "active"
    })
    
    if active_subscriptions > 0:
        raise HTTPException(
            status_code=400, 
            detail=f"Cannot delete product. It is used in {active_subscriptions} active subscription(s)"
        )
    
    # Delete the product
    db.products.delete_one({"_id": ObjectId(product_id)})
    
    return {"message": "Product deleted successfully", "id": product_id}


# ========== SUBSCRIPTION ENDPOINTS ==========

@app.get("/api/subscriptions", response_model=List[dict])
async def list_subscriptions(current_user: dict = Depends(get_current_user)):
    """Get user's subscriptions"""
    db = get_database()
    subscriptions = list(db.subscriptions.find({"user_id": current_user["user_id"]}))
    return serialize_doc(subscriptions)


@app.get("/api/subscriptions/{subscription_id}", response_model=dict)
async def get_subscription(subscription_id: str, current_user: dict = Depends(get_current_user)):
    """Get a specific subscription"""
    db = get_database()
    subscription = db.subscriptions.find_one({
        "_id": ObjectId(subscription_id),
        "user_id": current_user["user_id"]
    })
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return serialize_doc(subscription)


@app.post("/api/subscriptions", response_model=dict)
async def create_subscription(subscription: SubscriptionCreate, current_user: dict = Depends(get_current_user)):
    """Create a new subscription"""
    db = get_database()
    
    # Verify all products exist
    for item in subscription.items:
        product = db.products.find_one({"sku": item.sku})
        if not product:
            raise HTTPException(status_code=400, detail=f"Product {item.sku} not found")
    
    start_date = subscription.start_date or datetime.now()
    
    subscription_dict = {
        "user_id": current_user["user_id"],
        "items": [item.model_dump() for item in subscription.items],
        "frequency": subscription.frequency,
        "start_date": start_date,
        "next_run_at": start_date,
        "status": "active",
        "created_at": datetime.now()
    }
    
    result = db.subscriptions.insert_one(subscription_dict)
    created_subscription = db.subscriptions.find_one({"_id": result.inserted_id})
    return serialize_doc(created_subscription)


@app.patch("/api/subscriptions/{subscription_id}", response_model=dict)
async def update_subscription(subscription_id: str, update: SubscriptionUpdate, current_user: dict = Depends(get_current_user)):
    """Update a subscription (pause/resume or modify items/frequency)"""
    db = get_database()
    
    # Verify ownership
    existing = db.subscriptions.find_one({
        "_id": ObjectId(subscription_id),
        "user_id": current_user["user_id"]
    })
    if not existing:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    update_data = {}
    if update.status is not None:
        update_data["status"] = update.status
    if update.items is not None:
        update_data["items"] = [item.model_dump() for item in update.items]
    if update.frequency is not None:
        update_data["frequency"] = update.frequency
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = db.subscriptions.update_one(
        {"_id": ObjectId(subscription_id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    updated_subscription = db.subscriptions.find_one({"_id": ObjectId(subscription_id)})
    return serialize_doc(updated_subscription)


@app.delete("/api/subscriptions/{subscription_id}")
async def delete_subscription(subscription_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a subscription"""
    db = get_database()
    result = db.subscriptions.delete_one({
        "_id": ObjectId(subscription_id),
        "user_id": current_user["user_id"]
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    return {"message": "Subscription deleted successfully"}


# ========== ORDER ENDPOINTS ==========

@app.get("/api/orders", response_model=List[dict])
async def list_orders(user_stub_id: str = None):
    """Get all orders, optionally filtered by user"""
    db = get_database()
    query = {"user_stub_id": user_stub_id} if user_stub_id else {}
    orders = list(db.orders.find(query).sort("scheduled_for", -1))
    return serialize_doc(orders)


@app.get("/api/orders/{order_id}", response_model=dict)
async def get_order(order_id: str):
    """Get a specific order"""
    db = get_database()
    order = db.orders.find_one({"_id": ObjectId(order_id)})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return serialize_doc(order)


@app.patch("/api/orders/{order_id}/status", response_model=dict)
async def update_order_status(order_id: str, status: str):
    """Update order status (Admin)"""
    db = get_database()
    
    if status not in ["created", "blocked", "delivered", "cancelled"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    result = db.orders.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"status": status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    updated_order = db.orders.find_one({"_id": ObjectId(order_id)})
    return serialize_doc(updated_order)


# ========== SCHEDULER ENDPOINTS ==========

@app.post("/api/scheduler/run")
async def trigger_scheduler():
    """Manually trigger the order generation scheduler"""
    try:
        run_order_generation_job()
        return {"message": "Scheduler triggered successfully"}
    except Exception as e:
        logger.error(f"Error triggering scheduler: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ========== HEALTH CHECK ==========

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "GroFresh API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

