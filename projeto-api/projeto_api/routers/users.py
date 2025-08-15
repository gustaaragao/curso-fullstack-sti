from http import HTTPStatus

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from projeto_api.database import get_session
from projeto_api.models import User
from projeto_api.schemas import Message, UserList, UserPublic, UserSchema
from projeto_api.security import get_current_user, get_password_hash

router = APIRouter(prefix='/users', tags=['Usuários'])


@router.post('/', status_code=HTTPStatus.CREATED, response_model=UserPublic)
def create_user(
    user_form: UserSchema, session: Session = Depends(get_session)
):
    db_user = session.scalar(
        select(User).where(
            (User.username == user_form.username)
            | (User.email == user_form.email)
        )
    )

    if db_user:
        if db_user.username == user_form.username:
            raise HTTPException(
                status_code=HTTPStatus.CONFLICT,
                detail='Username already exists.',
            )
        elif db_user.email == user_form.email:
            raise HTTPException(
                status_code=HTTPStatus.CONFLICT, detail='Email already exists.'
            )

    # Criar uma entidade do User e persistir no BD
    hashed_password = get_password_hash(user_form.password)

    new_user = User(
        username=user_form.username,
        email=user_form.email,
        password=hashed_password,
    )

    # Adicionar o Usuario na minha Sessão
    session.add(new_user)
    # Salva minhas mudanças no Banco de Dados
    session.commit()
    # Atualizar meu objeto new_user
    session.refresh(new_user)

    return new_user


@router.get('/all', response_model=UserList)
def read_all_users(session: Session = Depends(get_session)):
    users = session.scalars(select(User)).all()

    return {'users': users}


@router.get('/', response_model=UserList)
def read_users(
    skip: int = 0, limit: int = 10, session: Session = Depends(get_session)
):
    users = session.scalars(select(User).offset(skip).limit(limit)).all()

    return {'users': users}


@router.put('/{user_id}', response_model=UserPublic)
def update_user(
    user_id: int,
    user_form: UserSchema,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    if current_user.id != user_id:
        raise HTTPException(
            status_code=HTTPStatus.FORBIDDEN, detail='Not enough permissions'
        )

    # Alterar os campos
    try:
        current_user.username = user_form.username
        current_user.email = user_form.email
        current_user.password = get_password_hash(user_form.password)

        session.commit()
        session.refresh(current_user)

        return current_user
    except IntegrityError:
        raise HTTPException(
            status_code=HTTPStatus.CONFLICT,
            detail='Username or Email already exists.',
        )


@router.delete('/{user_id}', response_model=Message)
def delete_user(
    user_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    if current_user.id != user_id:
        raise HTTPException(
            status_code=HTTPStatus.FORBIDDEN, detail='Not enough permissions'
        )

    session.delete(current_user)
    session.commit()

    return {'message': 'User deleted.'}
