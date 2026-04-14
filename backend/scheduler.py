from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
from database import get_database
import logging

logger = logging.getLogger(__name__)
scheduler = BackgroundScheduler()


def run_order_generation_job():
    """
    Idempotent order generation job
    Processes all active subscriptions whose next_run_at <= now
    """
    try:
        db = get_database()
        now = datetime.now()
        
        logger.info(f"Running order generation at {now}")
        
        # Find all subscriptions due for order generation
        due_subscriptions = db.subscriptions.find({
            "status": "active",
            "next_run_at": {"$lte": now}
        })
        
        orders_created = 0
        orders_blocked = 0
        
        for sub in due_subscriptions:
            sub_id = sub['_id']
            scheduled_for = sub['next_run_at']
            
            logger.info(f"Processing subscription {sub_id}")
            
            # Check if order already exists (idempotency)
            existing_order = db.orders.find_one({
                "subscription_id": str(sub_id),
                "scheduled_for": scheduled_for
            })
            
            if existing_order:
                logger.info(f"Order already exists for subscription {sub_id}, skipping")
                advance_next_run(db, sub_id, sub['frequency'], scheduled_for)
                continue
            
            # Check inventory for all items
            inventory_sufficient = True
            inventory_check = []
            
            for item in sub['items']:
                product = db.products.find_one({"sku": item['sku']})
                if not product or product['stock_on_hand'] < item['quantity']:
                    inventory_sufficient = False
                    inventory_check.append({
                        "sku": item['sku'],
                        "required": item['quantity'],
                        "available": product['stock_on_hand'] if product else 0
                    })
                else:
                    inventory_check.append({
                        "sku": item['sku'],
                        "required": item['quantity'],
                        "available": product['stock_on_hand']
                    })
            
            if not inventory_sufficient:
                # Create blocked order (do NOT decrement stock)
                order = {
                    "subscription_id": str(sub_id),
                    "user_stub_id": sub['user_stub_id'],
                    "items": sub['items'],
                    "scheduled_for": scheduled_for,
                    "status": "blocked",
                    "reason": "insufficient_inventory",
                    "inventory_check": inventory_check,
                    "created_at": datetime.now()
                }
                try:
                    db.orders.insert_one(order)
                    logger.warning(f"Order blocked for subscription {sub_id} - insufficient inventory")
                    orders_blocked += 1
                except Exception as e:
                    if "duplicate key" in str(e):
                        logger.info(f"Blocked order already exists (race condition)")
            else:
                # Sufficient inventory - create order and decrement stock atomically
                order = {
                    "subscription_id": str(sub_id),
                    "user_stub_id": sub['user_stub_id'],
                    "items": sub['items'],
                    "scheduled_for": scheduled_for,
                    "status": "created",
                    "created_at": datetime.now()
                }
                
                try:
                    db.orders.insert_one(order)
                    
                    # Decrement inventory atomically
                    for item in sub['items']:
                        db.products.update_one(
                            {"sku": item['sku']},
                            {"$inc": {"stock_on_hand": -item['quantity']}}
                        )
                    
                    logger.info(f"Order created for subscription {sub_id}")
                    orders_created += 1
                except Exception as e:
                    if "duplicate key" in str(e):
                        logger.info(f"Order already exists (race condition during creation)")
                    else:
                        logger.error(f"Error creating order: {e}")
            
            # Advance next_run_at
            advance_next_run(db, sub_id, sub['frequency'], scheduled_for)
        
        logger.info(f"Order generation complete: {orders_created} created, {orders_blocked} blocked")
        
    except Exception as e:
        logger.error(f"Error in order generation job: {e}")


def advance_next_run(db, subscription_id, frequency, current_run_at):
    """Advance the next_run_at based on frequency"""
    if frequency == "daily":
        next_run = current_run_at + timedelta(days=1)
    elif frequency == "weekly":
        next_run = current_run_at + timedelta(weeks=1)
    else:
        logger.error(f"Unknown frequency: {frequency}")
        return
    
    db.subscriptions.update_one(
        {"_id": subscription_id},
        {"$set": {"next_run_at": next_run}}
    )


def start_scheduler():
    """Start the background scheduler"""
    if not scheduler.running:
        # Run every hour
        scheduler.add_job(
            run_order_generation_job,
            'interval',
            hours=1,
            id='order_generation',
            replace_existing=True
        )
        scheduler.start()
        logger.info("Scheduler started")


def shutdown_scheduler():
    """Shutdown the scheduler gracefully"""
    if scheduler.running:
        scheduler.shutdown()
        logger.info("Scheduler shutdown")
