from fastapi import FastAPI
from controller.api import apiRouter
from fastapi.middleware.cors import CORSMiddleware
from controller.model_api import model_router

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

app.include_router(apiRouter,prefix='/api')
app.include_router(model_router,prefix='/ai')


@app.get('/')
def Healthcheck():
    return {"msg":"Hello form Bugs & Glitches"}

