"""
Seed script to add initial products to GroFresh
"""
import os
from pymongo import MongoClient
from datetime import datetime

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URL)
db = client['grofresh']

# Clear existing data
db.products.delete_many({})

# Sample products
products = [
    {
        "sku": "MILK001",
        "name": "Fresh Milk",
        "unit": "liter",
        "price": 60,
        "stock_on_hand": 100,
        "description": "Fresh farm milk delivered daily",
        "created_at": datetime.now()
    },
    {
        "sku": "VEG001",
        "name": "Organic Vegetables Mix",
        "unit": "kg",
        "price": 80,
        "stock_on_hand": 50,
        "description": "Fresh seasonal vegetables",
        "created_at": datetime.now()
    },
    {
        "sku": "FRUIT001",
        "name": "Seasonal Fruits",
        "unit": "kg",
        "price": 120,
        "stock_on_hand": 30,
        "description": "Fresh seasonal fruits",
        "created_at": datetime.now()
    },
    {
        "sku": "EGGS001",
        "name": "Farm Fresh Eggs",
        "unit": "dozen",
        "price": 90,
        "stock_on_hand": 40,
        "description": "Organic farm fresh eggs",
        "created_at": datetime.now()
    },
    {
        "sku": "BREAD001",
        "name": "Whole Wheat Bread",
        "unit": "loaf",
        "price": 50,
        "stock_on_hand": 25,
        "description": "Fresh whole wheat bread",
        "created_at": datetime.now()
    }
]

result = db.products.insert_many(products)
print(f"✅ Inserted {len(result.inserted_ids)} products")

for product in products:
    print(f"  - {product['sku']}: {product['name']} (Stock: {product['stock_on_hand']})")

print("\n✅ Database seeded successfully!")
client.close()
