from http import HTTPStatus

from fastapi.testclient import TestClient

from projeto_api.app import app


def test_root_should_return_ok_and_hello_world():
    # Arrange
    client = TestClient(app)

    # Act
    response = client.get('/')

    # Assert
    assert response.status_code == HTTPStatus.OK
    assert response.json() == {'message': 'Hello World!'}
