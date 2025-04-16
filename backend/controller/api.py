from fastapi import APIRouter, Request
from schema.device_model import DeviceModel
from datetime import datetime
from config.database import device_collection


apiRouter = APIRouter()

@apiRouter.get('/')
def readings():
    return {
        "msg": "is API Router"
    }

@apiRouter.get('/readings')
def readings():
    data = device_collection.
    return data

@apiRouter.post('/' )
async def readings(request: Request, device: DeviceModel):
    print(device)
    try:
        newDevice =  await device_collection.insert_one(device.model_dump())
    except error as error:
        print(error)
        
    return newDevice
    
