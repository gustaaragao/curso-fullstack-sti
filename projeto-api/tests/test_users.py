from http import HTTPStatus

from projeto_api.schemas import UserPublic


def test_create_user(client):
    response = client.post(
        '/users/',
        json={
            'username': 'test',
            'email': 'test@email.com',
            'password': 'secret',
        },
    )

    assert response.status_code == HTTPStatus.CREATED
    assert response.json() == {'username': 'test', 'email': 'test@email.com'}


def test_read_users_should_return_empty_list(client):
    # Act
    response = client.get('/users/')

    # Assert
    assert response.status_code == HTTPStatus.OK
    assert response.json() == {'users': []}


def test_read_users(client, user):
    # Arrange
    schema = UserPublic.model_validate(user).model_dump()

    # Act
    response = client.get('/users/')

    # Assert
    assert response.status_code == HTTPStatus.OK
    assert response.json() == {'users': [schema]}


def test_update_user(client, user, token):
    response = client.put(
        f'/users/{user.id}',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'username': 'gustavo',
            'email': 'gustavo@email.com',
            'password': 'new_secret',
        },
    )

    assert response.status_code == HTTPStatus.OK
    assert response.json() == {
        'username': 'gustavo',
        'email': 'gustavo@email.com',
    }


def test_delete_user(client, user, token):
    response = client.delete(
        f'/users/{user.id}',
        headers={'Authorization': f'Bearer {token}'},
    )

    assert response.status_code == HTTPStatus.OK
    assert response.json() == {'message': 'User deleted.'}
