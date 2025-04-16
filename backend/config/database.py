from motor import motor_asyncio

client = motor_asyncio.AsyncIOMotorClient('mongodb://localhost:27017')

db = client.get_database('hackgenx')

device_collection = db.get_collection("device")
reading_collection = db.get_collection("device")