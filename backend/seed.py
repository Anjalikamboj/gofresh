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

# Sample products with real images and detailed info
products = [
    {
        "sku": "MILK001",
        "name": "Fresh Milk",
        "unit": "liter",
        "price": 60,
        "stock_on_hand": 100,
        "description": "Fresh farm milk delivered daily",
        "long_description": "Our premium farm-fresh milk comes from happy, grass-fed cows on local farms. Delivered daily to ensure maximum freshness and nutrition. Rich in calcium, protein, and essential vitamins. Perfect for your morning coffee, cereal, or enjoying a refreshing glass. Pasteurized and homogenized for safety while maintaining natural goodness.",
        "image_url": "https://images.unsplash.com/photo-1768850418251-17480117ac9b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG1pbGslMjBib3R0bGUlMjBkYWlyeXxlbnwwfHx8fDE3NzYxNjE1NzV8MA&ixlib=rb-4.1.0&q=85",
        "images": [
            "https://images.unsplash.com/photo-1768850418251-17480117ac9b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG1pbGslMjBib3R0bGUlMjBkYWlyeXxlbnwwfHx8fDE3NzYxNjE1NzV8MA&ixlib=rb-4.1.0&q=85",
            "https://images.unsplash.com/photo-1635436338433-89747d0ca0ef?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwzfHxmcmVzaCUyMG1pbGslMjBkYWlyeSUyMGJvdHRsZXMlMjBnbGFzc3xlbnwwfHx8fDE3NzYxNjE3MTZ8MA&ixlib=rb-4.1.0&q=85",
            "https://images.unsplash.com/photo-1560848119-ec9255fd285b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwyfHxmcmVzaCUyMG1pbGslMjBkYWlyeSUyMGJvdHRsZXMlMjBnbGFzc3xlbnwwfHx8fDE3NzYxNjE3MTZ8MA&ixlib=rb-4.1.0&q=85",
            "https://images.unsplash.com/photo-1772990977842-55d675ce427e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG1pbGslMjBkYWlyeSUyMGJvdHRsZXMlMjBnbGFzc3xlbnwwfHx8fDE3NzYxNjE3MTZ8MA&ixlib=rb-4.1.0&q=85"
        ],
        "benefits": ["Rich in Calcium", "High in Protein", "Vitamin D Fortified", "Locally Sourced"],
        "storage": "Keep refrigerated at 4°C or below. Best consumed within 3 days of opening.",
        "created_at": datetime.now()
    },
    {
        "sku": "VEG001",
        "name": "Organic Vegetables Mix",
        "unit": "kg",
        "price": 80,
        "stock_on_hand": 50,
        "description": "Fresh seasonal vegetables",
        "long_description": "Handpicked organic vegetables fresh from our partner farms. This seasonal mix includes a variety of greens, root vegetables, and more. Grown without synthetic pesticides or fertilizers, ensuring you get the purest, most nutritious produce. Perfect for salads, stir-fries, soups, and healthy meals. Each batch is carefully selected for quality and freshness.",
        "image_url": "https://images.pexels.com/photos/33975355/pexels-photo-33975355.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "images": [
            "https://images.pexels.com/photos/33975355/pexels-photo-33975355.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "https://images.unsplash.com/photo-1676300186673-615bcc8d5d68?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwdmVnZXRhYmxlcyUyMGZyZXNoJTIwZ3JlZW5zfGVufDB8fHx8MTc3NjE2MTcxNnww&ixlib=rb-4.1.0&q=85",
            "https://images.unsplash.com/photo-1736757614152-d500988741db?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwyfHxvcmdhbmljJTIwdmVnZXRhYmxlcyUyMGZyZXNoJTIwZ3JlZW5zfGVufDB8fHx8MTc3NjE2MTcxNnww&ixlib=rb-4.1.0&q=85",
            "https://images.unsplash.com/photo-1741515042603-70545daeb0c4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwzfHxvcmdhbmljJTIwdmVnZXRhYmxlcyUyMGZyZXNoJTIwZ3JlZW5zfGVufDB8fHx8MTc3NjE2MTcxNnww&ixlib=rb-4.1.0&q=85"
        ],
        "benefits": ["100% Organic", "Pesticide-Free", "Farm Fresh Daily", "Rich in Vitamins"],
        "storage": "Store in a cool, dry place or refrigerate. Wash before use. Best consumed within 5-7 days.",
        "created_at": datetime.now()
    },
    {
        "sku": "FRUIT001",
        "name": "Seasonal Fruits",
        "unit": "kg",
        "price": 120,
        "stock_on_hand": 30,
        "description": "Fresh seasonal fruits",
        "long_description": "A delightful assortment of the finest seasonal fruits, handpicked at peak ripeness. Our fruit selection changes with the seasons to bring you the freshest, most flavorful options available. Rich in natural vitamins, antioxidants, and fiber. Perfect for healthy snacking, smoothies, or adding natural sweetness to your meals. Each piece is carefully inspected for quality.",
        "image_url": "https://images.unsplash.com/photo-1593629718768-e8860d848a15?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTZ8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNlYXNvbmFsJTIwZnJ1aXRzJTIwYmFza2V0fGVufDB8fHx8MTc3NjE2MTU3NXww&ixlib=rb-4.1.0&q=85",
        "images": [
            "https://images.unsplash.com/photo-1593629718768-e8860d848a15?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTZ8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNlYXNvbmFsJTIwZnJ1aXRzJTIwYmFza2V0fGVufDB8fHx8MTc3NjE2MTU3NXww&ixlib=rb-4.1.0&q=85",
            "https://images.unsplash.com/photo-1576221506205-a1b45deb55a9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzN8MHwxfHNlYXJjaHwzfHxmcmVzaCUyMGZydWl0cyUyMGJhc2tldCUyMGNvbG9yZnVsfGVufDB8fHx8MTc3NjE2MTcxNnww&ixlib=rb-4.1.0&q=85",
            "https://images.unsplash.com/photo-1760108273055-e9bb6e7f3a0c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzN8MHwxfHNlYXJjaHwyfHxmcmVzaCUyMGZydWl0cyUyMGJhc2tldCUyMGNvbG9yZnVsfGVufDB8fHx8MTc3NjE2MTcxNnww&ixlib=rb-4.1.0&q=85",
            "https://images.unsplash.com/photo-1773823307113-2dcc3609aa79?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzN8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0cyUyMGJhc2tldCUyMGNvbG9yZnVsfGVufDB8fHx8MTc3NjE2MTcxNnww&ixlib=rb-4.1.0&q=85"
        ],
        "benefits": ["Peak Ripeness", "High in Antioxidants", "Natural Vitamins", "Seasonal Selection"],
        "storage": "Keep at room temperature until ripe, then refrigerate. Wash before consuming.",
        "created_at": datetime.now()
    },
    {
        "sku": "EGGS001",
        "name": "Farm Fresh Eggs",
        "unit": "dozen",
        "price": 90,
        "stock_on_hand": 40,
        "description": "Organic farm fresh eggs",
        "long_description": "Premium farm-fresh eggs from free-range chickens raised on natural feed without antibiotics or hormones. These eggs feature bright orange yolks and firm whites, indicating superior nutrition and freshness. Perfect for breakfast, baking, or any recipe requiring eggs. Collected daily from our partner farms and delivered fresh to your doorstep. A complete protein source with essential amino acids.",
        "image_url": "https://images.unsplash.com/photo-1770430707534-6ddd7558c458?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxmYXJtJTIwZnJlc2glMjBlZ2dzJTIwY2FydG9ufGVufDB8fHx8MTc3NjE2MTU3NXww&ixlib=rb-4.1.0&q=85",
        "images": [
            "https://images.unsplash.com/photo-1770430707534-6ddd7558c458?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxmYXJtJTIwZnJlc2glMjBlZ2dzJTIwY2FydG9ufGVufDB8fHx8MTc3NjE2MTU3NXww&ixlib=rb-4.1.0&q=85",
            "https://images.unsplash.com/photo-1772472023164-61a6f0da9200?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODd8MHwxfHNlYXJjaHwyfHxmYXJtJTIwZWdncyUyMG9yZ2FuaWMlMjBicm93bnxlbnwwfHx8fDE3NzYxNjE3MTZ8MA&ixlib=rb-4.1.0&q=85",
            "https://images.unsplash.com/photo-1773587534652-1c823227b555?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODd8MHwxfHNlYXJjaHwxfHxmYXJtJTIwZWdncyUyMG9yZ2FuaWMlMjBicm93bnxlbnwwfHx8fDE3NzYxNjE3MTZ8MA&ixlib=rb-4.1.0&q=85",
            "https://images.unsplash.com/photo-1759082495730-2a5090278e7e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODd8MHwxfHNlYXJjaHwzfHxmYXJtJTIwZWdncyUyMG9yZ2FuaWMlMjBicm93bnxlbnwwfHx8fDE3NzYxNjE3MTZ8MA&ixlib=rb-4.1.0&q=85"
        ],
        "benefits": ["Free-Range", "No Antibiotics", "High Protein", "Omega-3 Rich"],
        "storage": "Refrigerate at 4°C or below. Best consumed within 3-4 weeks from collection date.",
        "created_at": datetime.now()
    },
    {
        "sku": "BREAD001",
        "name": "Whole Wheat Bread",
        "unit": "loaf",
        "price": 50,
        "stock_on_hand": 25,
        "description": "Fresh whole wheat bread",
        "long_description": "Artisan whole wheat bread baked fresh daily using traditional methods. Made with 100% whole wheat flour, natural yeast, and minimal ingredients for authentic flavor and texture. Rich in fiber and nutrients, this bread is perfect for sandwiches, toast, or enjoying with your favorite spreads. No preservatives or artificial additives. Each loaf is hand-crafted for consistent quality.",
        "image_url": "https://images.pexels.com/photos/28354522/pexels-photo-28354522.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "images": [
            "https://images.pexels.com/photos/28354522/pexels-photo-28354522.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "https://images.unsplash.com/photo-1744217083335-8b57ec3826ac?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwYnJlYWQlMjB3aG9sZSUyMGdyYWlufGVufDB8fHx8MTc3NjE2MTcxNnww&ixlib=rb-4.1.0&q=85",
            "https://images.unsplash.com/photo-1771757751633-4912e7282379?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHwzfHxhcnRpc2FuJTIwYnJlYWQlMjB3aG9sZSUyMGdyYWlufGVufDB8fHx8MTc3NjE2MTcxNnww&ixlib=rb-4.1.0&q=85",
            "https://images.unsplash.com/photo-1772273004112-79be1c208784?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHwyfHxhcnRpc2FuJTIwYnJlYWQlMjB3aG9sZSUyMGdyYWlufGVufDB8fHx8MTc3NjE2MTcxNnww&ixlib=rb-4.1.0&q=85"
        ],
        "benefits": ["100% Whole Wheat", "High Fiber", "No Preservatives", "Baked Daily"],
        "storage": "Store in a cool, dry place. Best consumed within 3-4 days. Can be frozen for longer storage.",
        "created_at": datetime.now()
    }
]

result = db.products.insert_many(products)
print(f"✅ Inserted {len(result.inserted_ids)} products")

for product in products:
    print(f"  - {product['sku']}: {product['name']} (Stock: {product['stock_on_hand']})")

print("\n✅ Database seeded successfully!")
client.close()
