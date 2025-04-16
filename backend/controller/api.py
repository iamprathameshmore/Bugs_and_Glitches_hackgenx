from fastapi import APIRouter, Request
from schema.device_model import DeviceModel
from schema.device_model import ReadingModel
from config.database import device_collection, reading_collection



apiRouter = APIRouter()

# Create Device API
@apiRouter.post('/' )
async def readingList(request: Request, device: DeviceModel):
    print(device)
    try:
        newDevice =  await device_collection.insert_one(device.model_dump())
        return {
            "success": False,
            "msg":"internal server error",
            "data": newDevice,
            "error":None
        }
    except error as error:
        print(error)
        return {
            "success": False,
            "msg":"internal server error",
            "data": None,
            "error":error
            }

# Get Device By Id API
@apiRouter.get('/device/{id}')
def getDevice():
    data = device_collection.get_io_loop()
    return data

# Add Reading API
@apiRouter.post('/reading')
async def addDevice(reading: ReadingModel):
    print(ReadingModel)
    try:
        newReading =  await reading_collection.insert_one(reading.model_dump())
        return {
            "success": False,
            "msg":"internal server error",
            "data": newReading,
            "error":None
        }
    except error as error:
        print(error)
        return {
            "success": False,
            "msg":"internal server error",
            "data": None,
            "error":error
            }
        
# Get Reading API
@apiRouter.get('/readings')
def readings():
    data = device_collection.get_io_loop()
    return data
    