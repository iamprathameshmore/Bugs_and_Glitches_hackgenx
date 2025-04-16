from fastapi import FastAPI, WebSocket
from controller.api import apiRouter

app = FastAPI()

app.include_router(apiRouter,prefix='/api')

@app.get('/')
def Healthcheck():
    return {"msg":"Hello form Bugs & Glitches"}

# @app.websocket('/ws')
# async def webscoket_func(ws: WebSocket):
#     await ws.accept()
#     while True:
#         data = await ws.receive_text()
#         print(data)