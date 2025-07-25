from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from pymongo.database import Database
from typing import AsyncGenerator
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get MongoDB connection details from environment variables
MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGODB_DB", "mes_rfid")

# Create a MongoDB client
client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

# Synchronous client for operations that don't support async
sync_client = MongoClient(MONGO_URI)
sync_db = sync_client[DB_NAME]

# Dependency to get the database instance
async def get_db() -> AsyncGenerator[Database, None]:
    """
    Dependency function that yields db connection.
    """
    try:
        yield db
    finally:
        # Clean up connection if needed
        pass

def get_sync_db() -> Database:
    """
    Get a synchronous database instance.
    """
    return sync_db
