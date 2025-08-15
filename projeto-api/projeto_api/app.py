from fastapi import FastAPI

from projeto_api.routers import auth, users

app = FastAPI()

app.include_router(users.router)
app.include_router(auth.router)


@app.get('/')
def read_root():
    return {'message': 'Hello World!'}
