import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from joblib import dump
import random
from datetime import datetime, timedelta
import math

def generate_synthetic_data(num_samples=500, start_time=None):
    data = []
    if not start_time:
        start_time = datetime.now() - timedelta(hours=num_samples)

    for _ in range(num_samples):
        temperature = round(random.uniform(10, 40), 2)
        humidity = round(random.uniform(20, 90), 2)
        air_quality = round(random.uniform(50, 300), 2)
        timestamp = start_time.strftime('%Y-%m-%dT%H:%M:%S')
        start_time += timedelta(hours=1)

        data.append({
            "_id": str(random.randint(1000000000, 9999999999)),
            "device_id": str(random.randint(1000000000, 9999999999)),
            "temperature": temperature,
            "humidity": humidity,
            "airQuality": air_quality,
            "timestamp": timestamp
        })
    return pd.DataFrame(data)

df = generate_synthetic_data()

df['timestamp'] = pd.to_datetime(df['timestamp'])
df['hour'] = df['timestamp'].dt.hour
df['day'] = df['timestamp'].dt.day
df['humidity_temp_ratio'] = df['humidity'] / df['temperature']

X = df[["temperature", "humidity", "hour", "day", "humidity_temp_ratio"]]
y = df["airQuality"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = XGBRegressor(n_estimators=150, learning_rate=0.1, max_depth=5, random_state=42, objective='reg:squarederror')
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
rmse = math.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print("Model Evaluation:")
print(f"MAE: {mae:.2f}")
print(f"RMSE: {rmse:.2f}")
print(f"R2 Score: {r2:.2f}")

dump(model, "air_quality_forecast_model.pkl")
print("Model trained and saved as 'air_quality_forecast_model.pkl'")
