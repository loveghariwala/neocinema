from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

class MongoDB:
    client: AsyncIOMotorClient = None

db = MongoDB()

async def get_db():
    if db.client is None:
        db.client = AsyncIOMotorClient(MONGO_URI)
    return db.client.neocinema

async def close_db():
    if db.client:
        db.client.close()
