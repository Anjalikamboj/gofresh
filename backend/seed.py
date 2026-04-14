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

# Sample products with real images
products = [
    {
        "sku": "MILK001",
        "name": "Fresh Milk",
        "unit": "liter",
        "price": 60,
        "stock_on_hand": 100,
        "description": "Fresh farm milk delivered daily",
        "image_url": "https://images.unsplash.com/photo-1768850418251-17480117ac9b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG1pbGslMjBib3R0bGUlMjBkYWlyeXxlbnwwfHx8fDE3NzYxNjE1NzV8MA&ixlib=rb-4.1.0&q=85",
        "created_at": datetime.now()
    },
    {
        "sku": "VEG001",
        "name": "Organic Vegetables Mix",
        "unit": "kg",
        "price": 80,
        "stock_on_hand": 50,
        "description": "Fresh seasonal vegetables",
        "image_url": "https://images.pexels.com/photos/33975355/pexels-photo-33975355.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "created_at": datetime.now()
    },
    {
        "sku": "FRUIT001",
        "name": "Seasonal Fruits",
        "unit": "kg",
        "price": 120,
        "stock_on_hand": 30,
        "description": "Fresh seasonal fruits",
        "image_url": "https://images.unsplash.com/photo-1593629718768-e8860d848a15?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTZ8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNlYXNvbmFsJTIwZnJ1aXRzJTIwYmFza2V0fGVufDB8fHx8MTc3NjE2MTU3NXww&ixlib=rb-4.1.0&q=85",
        "created_at": datetime.now()
    },
    {
        "sku": "EGGS001",
        "name": "Farm Fresh Eggs",
        "unit": "dozen",
        "price": 90,
        "stock_on_hand": 40,
        "description": "Organic farm fresh eggs",
        "image_url": "https://images.unsplash.com/photo-1770430707534-6ddd7558c458?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxmYXJtJTIwZnJlc2glMjBlZ2dzJTIwY2FydG9ufGVufDB8fHx8MTc3NjE2MTU3NXww&ixlib=rb-4.1.0&q=85",
        "created_at": datetime.now()
    },
    {
        "sku": "BREAD001",
        "name": "Whole Wheat Bread",
        "unit": "loaf",
        "price": 50,
        "stock_on_hand": 25,
        "description": "Fresh whole wheat bread",
        "image_url": "https://images.pexels.com/photos/28354522/pexels-photo-28354522.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "created_at": datetime.now()
    }
]

result = db.products.insert_many(products)
print(f"✅ Inserted {len(result.inserted_ids)} products")

for product in products:
    print(f"  - {product['sku']}: {product['name']} (Stock: {product['stock_on_hand']})")

print("\n✅ Database seeded successfully!")
client.close()
