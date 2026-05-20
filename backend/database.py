import os
from pymongo import MongoClient, ASCENDING
from pymongo.database import Database

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/')

client = None
db: Database = None


def get_database():
    global client, db
    if db is None:
        client = MongoClient(MONGO_URL)
        db = client['khetise']
        # Create indexes
        db.orders.create_index([("subscription_id", ASCENDING), ("scheduled_for", ASCENDING)], unique=True)
        db.subscriptions.create_index([("user_stub_id", ASCENDING)])
        db.products.create_index([("sku", ASCENDING)], unique=True)
    return db


def close_database():
    global client
    if client:
        client.close()
