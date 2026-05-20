"""
KhetiSe Phase 1 POC: Core Subscription Scheduling Test
Tests all critical user stories for subscription order generation
"""
import os
import sys
from datetime import datetime, timedelta
from pymongo import MongoClient, ASCENDING
from bson.objectid import ObjectId

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URL)
db = client['khetise_poc']

# Collections
products_col = db['products']
subscriptions_col = db['subscriptions']
orders_col = db['orders']


def setup_test_data():
    """Setup test data: products with initial inventory"""
    print("\n=== Setting up test data ===")
    
    # Clear existing data
    products_col.delete_many({})
    subscriptions_col.delete_many({})
    orders_col.delete_many({})
    
    # Create unique indexes
    print("Creating indexes...")
    orders_col.create_index([("subscription_id", ASCENDING), ("scheduled_for", ASCENDING)], unique=True)
    subscriptions_col.create_index([("user_stub_id", ASCENDING)])
    
    # Insert test products
    products = [
        {"sku": "MILK001", "name": "Fresh Milk", "unit": "liter", "price": 60, "stock_on_hand": 100},
        {"sku": "VEG001", "name": "Organic Vegetables", "unit": "kg", "price": 80, "stock_on_hand": 50},
        {"sku": "FRUIT001", "name": "Seasonal Fruits", "unit": "kg", "price": 120, "stock_on_hand": 10}
    ]
    result = products_col.insert_many(products)
    print(f"✓ Created {len(result.inserted_ids)} products")
    
    return {p['sku']: p for p in products}


def create_subscription(user_stub_id, items, frequency, start_date=None):
    """Create a subscription with given parameters"""
    if start_date is None:
        start_date = datetime.now()
    
    subscription = {
        "user_stub_id": user_stub_id,
        "items": items,  # [{"sku": "MILK001", "quantity": 2}, ...]
        "frequency": frequency,  # "daily" or "weekly"
        "start_date": start_date,
        "next_run_at": start_date,
        "status": "active",
        "created_at": datetime.now()
    }
    result = subscriptions_col.insert_one(subscription)
    return result.inserted_id


def run_scheduler(simulated_now=None):
    """
    Idempotent order generation scheduler
    Processes all active subscriptions whose next_run_at <= now
    """
    if simulated_now is None:
        simulated_now = datetime.now()
    
    print(f"\n🔄 Running scheduler at {simulated_now}")
    
    # Find all subscriptions due for order generation
    due_subscriptions = subscriptions_col.find({
        "status": "active",
        "next_run_at": {"$lte": simulated_now}
    })
    
    orders_created = 0
    orders_blocked = 0
    
    for sub in due_subscriptions:
        sub_id = sub['_id']
        scheduled_for = sub['next_run_at']
        
        print(f"  Processing subscription {sub_id} (user: {sub['user_stub_id']}, freq: {sub['frequency']})")
        
        # Check if order already exists (idempotency)
        existing_order = orders_col.find_one({
            "subscription_id": sub_id,
            "scheduled_for": scheduled_for
        })
        
        if existing_order:
            print(f"    ⏭️  Order already exists (idempotent skip)")
            # Still advance next_run_at if needed
            advance_next_run(sub_id, sub['frequency'], scheduled_for)
            continue
        
        # Check inventory for all items
        inventory_sufficient = True
        inventory_check = []
        
        for item in sub['items']:
            product = products_col.find_one({"sku": item['sku']})
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
                "subscription_id": sub_id,
                "user_stub_id": sub['user_stub_id'],
                "items": sub['items'],
                "scheduled_for": scheduled_for,
                "status": "blocked",
                "reason": "insufficient_inventory",
                "inventory_check": inventory_check,
                "created_at": datetime.now()
            }
            try:
                orders_col.insert_one(order)
                print(f"    ⚠️  Order BLOCKED - insufficient inventory")
                orders_blocked += 1
            except Exception as e:
                if "duplicate key" in str(e):
                    print(f"    ⏭️  Blocked order already exists (race condition)")
        else:
            # Sufficient inventory - create order and decrement stock atomically
            order = {
                "subscription_id": sub_id,
                "user_stub_id": sub['user_stub_id'],
                "items": sub['items'],
                "scheduled_for": scheduled_for,
                "status": "created",
                "created_at": datetime.now()
            }
            
            try:
                orders_col.insert_one(order)
                
                # Decrement inventory atomically
                for item in sub['items']:
                    products_col.update_one(
                        {"sku": item['sku']},
                        {"$inc": {"stock_on_hand": -item['quantity']}}
                    )
                
                print(f"    ✅ Order CREATED - inventory decremented")
                orders_created += 1
            except Exception as e:
                if "duplicate key" in str(e):
                    print(f"    ⏭️  Order already exists (race condition during creation)")
                else:
                    raise
        
        # Advance next_run_at
        advance_next_run(sub_id, sub['frequency'], scheduled_for)
    
    print(f"\n📊 Scheduler summary: {orders_created} created, {orders_blocked} blocked")
    return {"created": orders_created, "blocked": orders_blocked}


def advance_next_run(subscription_id, frequency, current_run_at):
    """Advance the next_run_at based on frequency"""
    if frequency == "daily":
        next_run = current_run_at + timedelta(days=1)
    elif frequency == "weekly":
        next_run = current_run_at + timedelta(weeks=1)
    else:
        raise ValueError(f"Unknown frequency: {frequency}")
    
    subscriptions_col.update_one(
        {"_id": subscription_id},
        {"$set": {"next_run_at": next_run}}
    )


def pause_subscription(subscription_id):
    """Pause a subscription"""
    subscriptions_col.update_one(
        {"_id": subscription_id},
        {"$set": {"status": "paused"}}
    )


def resume_subscription(subscription_id):
    """Resume a subscription"""
    subscriptions_col.update_one(
        {"_id": subscription_id},
        {"$set": {"status": "active"}}
    )


# ========== TEST CASES ==========

def test_1_daily_subscription_three_orders():
    """User Story 2: Daily subscription generates 3 consecutive orders"""
    print("\n" + "="*60)
    print("TEST 1: Daily subscription generates 3 consecutive orders")
    print("="*60)
    
    setup_test_data()
    
    # Create daily subscription
    start_date = datetime(2026, 1, 1, 8, 0, 0)
    items = [{"sku": "MILK001", "quantity": 2}]
    sub_id = create_subscription("user_001", items, "daily", start_date)
    print(f"Created daily subscription: {sub_id}")
    
    # Run scheduler for 3 consecutive days
    day1 = start_date
    day2 = start_date + timedelta(days=1)
    day3 = start_date + timedelta(days=2)
    
    run_scheduler(day1)
    run_scheduler(day2)
    run_scheduler(day3)
    
    # Verify 3 orders created
    orders = list(orders_col.find({"subscription_id": sub_id}))
    assert len(orders) == 3, f"Expected 3 orders, got {len(orders)}"
    
    # Verify stock decreased (100 - 6 = 94)
    milk_product = products_col.find_one({"sku": "MILK001"})
    assert milk_product['stock_on_hand'] == 94, f"Expected stock 94, got {milk_product['stock_on_hand']}"
    
    print("✅ TEST 1 PASSED: 3 orders created, stock correctly decremented")


def test_2_weekly_subscription_cadence():
    """User Story 3: Weekly subscription generates correct weekly cadence"""
    print("\n" + "="*60)
    print("TEST 2: Weekly subscription generates correct weekly cadence")
    print("="*60)
    
    setup_test_data()
    
    # Create weekly subscription
    start_date = datetime(2026, 1, 1, 8, 0, 0)
    items = [{"sku": "VEG001", "quantity": 5}]
    sub_id = create_subscription("user_002", items, "weekly", start_date)
    print(f"Created weekly subscription: {sub_id}")
    
    # Run scheduler weekly for 3 weeks
    week1 = start_date
    week2 = start_date + timedelta(weeks=1)
    week3 = start_date + timedelta(weeks=2)
    
    run_scheduler(week1)
    run_scheduler(week2)
    run_scheduler(week3)
    
    # Verify 3 orders created
    orders = list(orders_col.find({"subscription_id": sub_id}))
    assert len(orders) == 3, f"Expected 3 orders, got {len(orders)}"
    
    # Verify scheduled dates are weekly apart
    assert orders[0]['scheduled_for'] == week1
    assert orders[1]['scheduled_for'] == week2
    assert orders[2]['scheduled_for'] == week3
    
    print("✅ TEST 2 PASSED: Weekly orders created with correct cadence")


def test_3_idempotency_duplicate_runs():
    """User Story: Duplicate runs do not create duplicate orders"""
    print("\n" + "="*60)
    print("TEST 3: Idempotency - duplicate runs don't create duplicates")
    print("="*60)
    
    setup_test_data()
    
    # Create daily subscription
    start_date = datetime(2026, 1, 1, 8, 0, 0)
    items = [{"sku": "MILK001", "quantity": 2}]
    sub_id = create_subscription("user_003", items, "daily", start_date)
    
    # Run scheduler 3 times for the same date
    run_scheduler(start_date)
    run_scheduler(start_date)
    run_scheduler(start_date)
    
    # Verify only 1 order created
    orders = list(orders_col.find({"subscription_id": sub_id}))
    assert len(orders) == 1, f"Expected 1 order (idempotent), got {len(orders)}"
    
    # Verify stock decreased only once (100 - 2 = 98)
    milk_product = products_col.find_one({"sku": "MILK001"})
    assert milk_product['stock_on_hand'] == 98, f"Expected stock 98, got {milk_product['stock_on_hand']}"
    
    print("✅ TEST 3 PASSED: Idempotency enforced, no duplicate orders")


def test_4_inventory_shortage_blocks_order():
    """User Story 4: Inventory shortage blocks order and doesn't reduce stock"""
    print("\n" + "="*60)
    print("TEST 4: Inventory shortage blocks order without stock reduction")
    print("="*60)
    
    setup_test_data()
    
    # Create subscription requiring more stock than available
    start_date = datetime(2026, 1, 1, 8, 0, 0)
    items = [{"sku": "FRUIT001", "quantity": 15}]  # Only 10 available
    sub_id = create_subscription("user_004", items, "daily", start_date)
    
    # Run scheduler
    run_scheduler(start_date)
    
    # Verify order blocked
    orders = list(orders_col.find({"subscription_id": sub_id}))
    assert len(orders) == 1, f"Expected 1 order, got {len(orders)}"
    assert orders[0]['status'] == "blocked", f"Expected blocked order, got {orders[0]['status']}"
    
    # Verify stock NOT decreased (still 10)
    fruit_product = products_col.find_one({"sku": "FRUIT001"})
    assert fruit_product['stock_on_hand'] == 10, f"Expected stock 10, got {fruit_product['stock_on_hand']}"
    
    print("✅ TEST 4 PASSED: Order blocked, stock unchanged")


def test_5_pause_resume_subscription():
    """User Story 5: Pause stops generation, resume restarts correctly"""
    print("\n" + "="*60)
    print("TEST 5: Pause/Resume subscription functionality")
    print("="*60)
    
    setup_test_data()
    
    # Create daily subscription
    start_date = datetime(2026, 1, 1, 8, 0, 0)
    items = [{"sku": "MILK001", "quantity": 2}]
    sub_id = create_subscription("user_005", items, "daily", start_date)
    
    # Day 1: Generate order
    day1 = start_date
    run_scheduler(day1)
    
    # Pause subscription
    pause_subscription(sub_id)
    print("⏸️  Subscription paused")
    
    # Day 2: Try to generate (should skip because paused)
    day2 = start_date + timedelta(days=1)
    run_scheduler(day2)
    
    # Verify only 1 order exists (day 2 skipped)
    orders = list(orders_col.find({"subscription_id": sub_id}))
    assert len(orders) == 1, f"Expected 1 order (day 2 paused), got {len(orders)}"
    
    # Resume subscription
    resume_subscription(sub_id)
    print("▶️  Subscription resumed")
    
    # Day 2 again (should now create order)
    run_scheduler(day2)
    
    # Verify 2 orders now exist
    orders = list(orders_col.find({"subscription_id": sub_id}))
    assert len(orders) == 2, f"Expected 2 orders after resume, got {len(orders)}"
    
    print("✅ TEST 5 PASSED: Pause/Resume works correctly")


def run_all_tests():
    """Run all POC tests"""
    print("\n" + "🚀"*30)
    print("KHETISE PHASE 1 POC - CORE SCHEDULING TESTS")
    print("🚀"*30)
    
    try:
        test_1_daily_subscription_three_orders()
        test_2_weekly_subscription_cadence()
        test_3_idempotency_duplicate_runs()
        test_4_inventory_shortage_blocks_order()
        test_5_pause_resume_subscription()
        
        print("\n" + "="*60)
        print("🎉 ALL POC TESTS PASSED!")
        print("="*60)
        print("\n✅ Core scheduling workflow verified:")
        print("  - Daily/weekly subscriptions work")
        print("  - Idempotency enforced")
        print("  - Inventory checks prevent over-allocation")
        print("  - Pause/resume functionality works")
        print("\n📋 Ready to proceed to Phase 2: Full App Development")
        
        return True
        
    except AssertionError as e:
        print(f"\n❌ TEST FAILED: {e}")
        return False
    except Exception as e:
        print(f"\n💥 ERROR: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
