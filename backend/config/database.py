import os
from dotenv import load_dotenv
from motor import motor_asyncio

load_dotenv()


MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("MONGO_DB")
print(MONGO_DB, MONGO_URI)

client = motor_asyncio.AsyncIOMotorClient(MONGO_URI)

db = client.get_database(MONGO_DB)

device_collection = db.get_collection("device")
reading_collection = db.get_collection("reading")