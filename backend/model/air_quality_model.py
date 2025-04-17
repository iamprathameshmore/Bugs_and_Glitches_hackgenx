
from joblib import load
import os

def load_model():
    model_path = os.path.join(os.path.dirname(__file__), 'air_quality_forecast_model.pkl')
    model = load(model_path)
    return model
