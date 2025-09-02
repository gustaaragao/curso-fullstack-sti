from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from projeto_api.database import get_session
from projeto_api.models import Todo, User
from projeto_api.schemas import (
    FilterTodo,
    Message,
    TodoList,
    TodoPublic,
    TodoSchema,
    TodoUpdate,
)
from projeto_api.security import get_current_user

router = APIRouter(prefix='/todos', tags=['todos'])

DBSession = Annotated[AsyncSession, Depends(get_session)]
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.post('/', response_model=TodoPublic, status_code=HTTPStatus.CREATED)
async def create_todo(todo: TodoSchema, user: CurrentUser, session: DBSession):
    db_todo = Todo(
        title=todo.title,
        description=todo.description,
        state=todo.state,
        user_id=user.id,
    )

    session.add(db_todo)
    await session.commit()
    await session.refresh(db_todo)

    return db_todo


@router.get('/', response_model=TodoList)
async def read_todos(
    user: CurrentUser,
    session: DBSession,
    filters: Annotated[FilterTodo, Query()],
):
    # Query para buscar TODOs do usuário
    query = select(Todo).where(Todo.user_id == user.id)

    if filters.title:
        query = query.filter(Todo.title.contains(filters.title))

    if filters.description:
        query = query.filter(Todo.description.contains(filters.description))

    if filters.state:
        # Nao podemos usar o contains, pois o state é um Enum
        query = query.filter(Todo.state == filters.state)

    result = await session.execute(
        query.offset(filters.offset).limit(filters.limit)
    )
    todos = result.scalars().all()

    return {'todos': todos}


@router.patch('/{todo_id}', response_model=TodoPublic)
async def patch_todo(
    todo_id: int, user: CurrentUser, session: DBSession, todo: TodoUpdate
):
    result = await session.execute(
        select(Todo).where(Todo.user_id == user.id, Todo.id == todo_id)
    )
    db_todo = result.scalar_one_or_none()

    if not db_todo:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Todo not found.'
        )

    for key, value in todo.model_dump(exclude_unset=True).items():
        # model_dump: transforma um obj Pydantic em um dicionario
        # exclude_unset = True: ignora os campos None
        setattr(db_todo, key, value)  # db_todo.key = value

    session.add(db_todo)
    await session.commit()
    await session.refresh(db_todo)

    return db_todo


@router.delete('/{todo_id}', response_model=Message)
async def delete_todo(todo_id: int, user: CurrentUser, session: DBSession):
    result = await session.execute(
        select(Todo).where(Todo.user_id == user.id, Todo.id == todo_id)
    )
    db_todo = result.scalar_one_or_none()

    if not db_todo:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Todo not found.'
        )

    await session.delete(db_todo)
    await session.commit()

    return {'message': 'Todo has been deleted successfully.'}
