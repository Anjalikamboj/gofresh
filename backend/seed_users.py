"""
Seed admin user for GroFresh
"""
import os
from pymongo import MongoClient
from datetime import datetime
from passlib.context import CryptContext

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URL)
db = client['grofresh']

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create admin user
admin_email = "admin@grofresh.com"
admin_password = "admin123"

# Check if admin exists
existing_admin = db.users.find_one({"email": admin_email})

if existing_admin:
    print(f"⚠️  Admin user already exists: {admin_email}")
else:
    admin_user = {
        "email": admin_email,
        "full_name": "Admin User",
        "hashed_password": pwd_context.hash(admin_password),
        "role": "admin",
        "created_at": datetime.now()
    }
    
    result = db.users.insert_one(admin_user)
    print(f"✅ Admin user created!")
    print(f"   Email: {admin_email}")
    print(f"   Password: {admin_password}")
    print(f"   Role: admin")

# Create regular test user
user_email = "user@grofresh.com"
user_password = "user123"

existing_user = db.users.find_one({"email": user_email})

if existing_user:
    print(f"⚠️  Test user already exists: {user_email}")
else:
    test_user = {
        "email": user_email,
        "full_name": "Test User",
        "hashed_password": pwd_context.hash(user_password),
        "role": "user",
        "created_at": datetime.now()
    }
    
    result = db.users.insert_one(test_user)
    print(f"✅ Test user created!")
    print(f"   Email: {user_email}")
    print(f"   Password: {user_password}")
    print(f"   Role: user")

print("\n✅ User seeding complete!")
client.close()
