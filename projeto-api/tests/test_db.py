from dataclasses import asdict

import pytest
from sqlalchemy import select

from projeto_api.models import User


@pytest.mark.asyncio
async def test_create_user(session, mock_db_time):
    with mock_db_time(model=User) as time:
        new_user = User(
            username='test', password='secret', email='test@email.com'
        )
        session.add(new_user)
        await session.commit()

    user = await session.scalar(select(User).where(User.username == 'test'))

    assert asdict(user) == {
        'id': 1,
        'username': 'test',
        'password': 'secret',
        'email': 'test@email.com',
        'created_at': time,
    }
