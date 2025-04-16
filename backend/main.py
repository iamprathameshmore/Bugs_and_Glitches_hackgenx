from fastapi import FastAPI
from controller.api import apiRouter

app = FastAPI()

app.include_router(apiRouter,prefix='/api')

@app.get('/')
def Healthcheck():
    return {"msg":"Hello form Bugs & Glitches"}

