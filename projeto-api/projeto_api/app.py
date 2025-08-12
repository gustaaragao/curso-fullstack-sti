from fastapi import FastAPI

from projeto_api.routers import users

app = FastAPI()

app.include_router(users.router)


@app.get('/')
def read_root():
    return {'message': 'Hello World!'}
