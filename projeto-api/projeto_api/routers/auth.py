from http import HTTPStatus

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from projeto_api.database import get_session
from projeto_api.models import User
from projeto_api.schemas import Token
from projeto_api.security import (
    create_access_token,
    verify_password,
)

router = APIRouter(prefix='/auth', tags=['auth'])


@router.post('/token', response_model=Token)
async def login_for_access_token(
    session: AsyncSession = Depends(get_session),
    form_data: OAuth2PasswordRequestForm = Depends(),
    # Formulário pronto do FastAPI que aparecerá no docs ou redocs
    # possui os campos username e password
):
    # Login é feito com o e-mail
    user = await session.scalar(
        select(User).where(User.email == form_data.username)
    )

    if not user:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail='Incorrect email or password',
        )

    if not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail='Incorrect email or password',
        )

    access_token = create_access_token(data={'sub': form_data.username})

    return {'access_token': access_token, 'token_type': 'bearer'}
