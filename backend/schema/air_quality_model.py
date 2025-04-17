from pydantic import BaseModel

class AirQualityInput(BaseModel):
    temperature: float
    humidity: float
    timestamp: str 