from http import HTTPStatus

from projeto_api.schemas import UserPublic


def test_create_user(client):
    # Act
    response = client.post(
        '/users',
        json={
            'username': 'test',
            'email': 'test@example.com',
            'password': 'password',
        },
    )
    # Assert
    assert response.status_code == HTTPStatus.CREATED
    assert response.json() == {
        'username': 'test',
        'email': 'test@example.com',
    }


def test_read_users(client, user):
    # SCHEMA.model_validate(OBJETO) -> Valida o OBJETO a partir do SCHEMA
    schema = UserPublic.model_validate(user).model_dump()

    response = client.get('/users')

    assert response.status_code == HTTPStatus.OK
    assert response.json() == {'users': [schema]}


def test_update_user(client, user):
    response = client.put(
        f'/users/{user.id}',
        json={
            'username': 'bob',
            'email': 'bob@example.com',
            'password': 'mynewpassword',
        },
    )
    assert response.status_code == HTTPStatus.OK
    assert response.json() == {
        'username': 'bob',
        'email': 'bob@example.com'
    }


def test_delete_user(client, user):
    response = client.delete(f'/users/{user.id}')
    assert response.status_code == HTTPStatus.OK
    assert response.json() == {'message': 'User deleted'}
