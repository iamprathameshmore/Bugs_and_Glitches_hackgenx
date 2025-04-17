# app/controller/model_controller.py
from fastapi import APIRouter, HTTPException
import pandas as pd
from schema.air_quality_model import AirQualityInput
from model.air_quality_model import load_model

model = load_model()

model_router = APIRouter()

@model_router.post("/predict-air-quality")
async def predict_air_quality(data: AirQualityInput):
    try:
        timestamp = pd.to_datetime(data.timestamp)
        hour = timestamp.hour
        day = timestamp.day
        humidity_temp_ratio = data.humidity / data.temperature if data.temperature != 0 else 0
        
        features = pd.DataFrame([{
            "temperature": data.temperature,
            "humidity": data.humidity,
            "hour": hour,
            "day": day,
            "humidity_temp_ratio": humidity_temp_ratio
        }])

        prediction = model.predict(features)[0]

        return {
            "predicted_air_quality": round(float(prediction), 2),
            "input": data.dict()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
