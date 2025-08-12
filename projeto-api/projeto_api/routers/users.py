from http import HTTPStatus

from fastapi import APIRouter

from projeto_api.schemas import UserPublic, UserSchema

router = APIRouter(prefix='/users', tags=['users'])


@router.post('/', status_code=HTTPStatus.CREATED, response_model=UserPublic)
def create_user(user: UserSchema):
    return user


@router.get('/')
def read_users():
    return [
        {
            'username': 'Gustavo',
            'email': 'gustavo@email.com',
            'password': 'batatinha123',
        }
    ]
