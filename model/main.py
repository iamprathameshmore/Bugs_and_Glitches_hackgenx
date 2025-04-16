import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from joblib import dump


df = pd.read_csv("sample_data/pollution_data.csv")

X = df[["mq135", "temperature", "humidity"]]
y = df["label"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier()


model.fit(X_train, y_train)

dump(model, "air_quality_model.pkl")
print("Model trained and saved.")
