from fastapi import APIRouter, HTTPException
from schema.device_model import DeviceModel
from schema.reading_model import ReadingModel
from datetime import datetime
from config.database import device_collection, reading_collection
from pymongo.errors import PyMongoError
from bson import ObjectId  

apiRouter = APIRouter()

def serialize_device(device):
    if "_id" in device:
        device["_id"] = str(device["_id"])  
    return device


@apiRouter.get('/devices')
async def get_devices():
    try:
        devices = await device_collection.find().to_list(length=100)
        if not devices:
            raise HTTPException(status_code=404, detail="No devices found")
        return [serialize_device(device) for device in devices] 
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")


@apiRouter.get('/devices/{device_id}')
async def get_device(device_id: str):
    try:
        device = await device_collection.find_one({"_id": ObjectId(device_id)}) 
        if not device:
            raise HTTPException(status_code=404, detail="Device not found")
        return serialize_device(device)
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")


@apiRouter.post('/devices')
async def add_device(device: DeviceModel):
    try:
        new_device = await device_collection.insert_one(device.model_dump())
        return {"msg": "Device added successfully", "device_id": str(new_device.inserted_id)}
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Error inserting device: {e}")
    
    
@apiRouter.delete('/devices/{device_id}')
async def delete_device(device_id: str):
    try:
        if not ObjectId.is_valid(device_id):
            raise HTTPException(status_code=400, detail="Invalid device ID format")

        result = await device_collection.delete_one({"_id": ObjectId(device_id)})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Device not found")

        return {"msg": "Device deleted successfully", "device_id": device_id}

    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Error deleting device: {e}")


@apiRouter.post("/readings/{device_id}")
async def add_reading(device_id: str, reading: ReadingModel):
    try:
        if not ObjectId.is_valid(device_id):
            raise HTTPException(status_code=400, detail="Invalid device ID format")

        device = await device_collection.find_one({"_id": ObjectId(device_id)})
        if not device:
            raise HTTPException(status_code=404, detail="Device not found")

        reading_doc = {
            "device_id": ObjectId(device_id),
            "temperature": reading.temperature,
            "humidity": reading.humidity,
            "airQuality": reading.airQuality,
            "timestamp": datetime.now()
        }

        await reading_collection.insert_one(reading_doc)
        return {"msg": "Reading added successfully"}

    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")


@apiRouter.get("/readings/{device_id}", response_model=dict)
async def get_readings(device_id: str):
    try:
        if not ObjectId.is_valid(device_id):
            raise HTTPException(status_code=400, detail="Invalid device ID format")

        device = await device_collection.find_one({"_id": ObjectId(device_id)})
        if not device:
            raise HTTPException(status_code=404, detail="Device not found")

        readings_cursor = reading_collection.find({"device_id": ObjectId(device_id)}).sort("timestamp", -1)
        readings = await readings_cursor.to_list(length=None)

        formatted_readings = [
            ReadingModel(
                temperature=reading["temperature"],
                humidity=reading["humidity"],
                airQuality=reading["airQuality"],
                timestamp=reading["timestamp"].strftime("%Y-%m-%d %H:%M:%S")
            )
            for reading in readings
        ]

        return {"device_id": device_id, "readings": formatted_readings}

    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")