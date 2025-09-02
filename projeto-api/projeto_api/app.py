from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from projeto_api.routers import auth, todos, users

app = FastAPI()

# Permitindo o nosso Front-end consumir nossa API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(auth.router)
app.include_router(todos.router)


@app.get('/')
def read_root():
    return {'message': 'Hello World!'}
