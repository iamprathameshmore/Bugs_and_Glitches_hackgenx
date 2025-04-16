from pydantic import BaseModel
from bson import ObjectId
from typing import Optional
from datetime import datetime

class ReadingModel(BaseModel):
    temperature: float
    humidity: float
    airQuality: int
    timestamp:  Optional[datetime] = None

    class Config:
        json_encoders = {
            ObjectId: str
        }
