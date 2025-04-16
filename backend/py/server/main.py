from fastapi import FastAPI

app = FastAPI()

@app.get('/')
def Healthcheck():
    return {"msg":"Hello form Bugs & Glitches"}