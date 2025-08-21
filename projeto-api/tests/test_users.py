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


def test_update_user_with_wrong_user(client, other_user, token):
    response = client.put(
        f'/users/{other_user.id}',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'username': 'gustavo',
            'email': 'gustavo@email.com',
            'password': 'new_secret',
        },
    )

    assert response.status_code == HTTPStatus.FORBIDDEN
    assert response.json() == {'detail': 'Not enough permissions'}


def test_delete_user(client, user, token):
    response = client.delete(
        f'/users/{user.id}',
        headers={'Authorization': f'Bearer {token}'},
    )

    assert response.status_code == HTTPStatus.OK
    assert response.json() == {'message': 'User deleted.'}


def test_delete_user_with_wrong_user(client, other_user, token):
    response = client.delete(
        f'/users/{other_user.id}',
        headers={'Authorization': f'Bearer {token}'},
    )

    assert response.status_code == HTTPStatus.FORBIDDEN
    assert response.json() == {'detail': 'Not enough permissions'}
