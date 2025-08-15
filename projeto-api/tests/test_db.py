from dataclasses import asdict

from sqlalchemy import select

from projeto_api.models import User


def test_create_user(session, mock_db_time):
    with mock_db_time(model=User) as time:
        new_user = User(
            username='test', password='secret', email='test@email.com'
        )
        session.add(new_user)
        session.commit()

    user = session.scalar(select(User).where(User.username == 'test'))

    assert asdict(user) == {
        'id': 1,
        'username': 'test',
        'password': 'secret',
        'email': 'test@email.com',
        'created_at': time,
    }
