from http import HTTPStatus

import factory
import factory.fuzzy
import pytest

from projeto_api.models import Todo, TodoState


class TodoFactory(factory.Factory):
    class Meta:
        model = Todo

    title = factory.Faker('text')
    description = factory.Faker('text')
    state = factory.fuzzy.FuzzyChoice(TodoState)
    user_id = 1


def test_create_todo(client, token, mock_db_time):
    title = 'Test Todo'
    description = 'Test Description'
    state = TodoState.draft

    with mock_db_time(model=Todo) as time:
        response = client.post(
            '/todos',
            headers={'Authorization': f'Bearer {token}'},
            json={
                'title': title,
                'description': description,
                'state': state.value,
            },
        )

    assert response.status_code == HTTPStatus.CREATED
    assert response.json() == {
        'id': 1,
        'title': title,
        'description': description,
        'state': state.value,
        'created_at': time.isoformat(),
        'updated_at': time.isoformat(),
    }


def test_create_todo_invalid_state_error(client, token):
    response = client.post(
        '/todos',
        headers={'Authorization': f'Bearer {token}'},
        json={
            'title': 'Test Todo',
            'description': 'Test Description',
            'state': 'invalid',
        },
    )

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY


@pytest.mark.asyncio
async def test_read_todos_should_return_5_todos(client, session, user, token):
    expect_todos = 5
    session.add_all(TodoFactory.create_batch(5, user_id=user.id))
    await session.commit()

    response = client.get(
        '/todos/',
        headers={'Authorization': f'Bearer {token}'},
    )

    assert len(response.json()['todos']) == expect_todos


@pytest.mark.asyncio
async def test_read_todos_pagination_should_return_2_todos(
    client, session, user, token
):
    expect_todos = 2
    session.add_all(TodoFactory.create_batch(5, user_id=user.id))
    await session.commit()

    response = client.get(
        '/todos/?limit=2',
        headers={'Authorization': f'Bearer {token}'},
    )

    assert len(response.json()['todos']) == expect_todos


@pytest.mark.asyncio
async def test_read_todos_filter_title_should_return_5_todos(
    client, session, user, token
):
    expect_todos = 5
    title = 'Test Title'
    session.add_all(TodoFactory.create_batch(5, user_id=user.id, title=title))
    await session.commit()

    response = client.get(
        f'/todos/?title={title}', headers={'Authorization': f'Bearer {token}'}
    )

    assert len(response.json()['todos']) == expect_todos


@pytest.mark.asyncio
async def test_read_todos_filter_description_should_return_5_todos(
    client, session, user, token
):
    expect_todos = 5
    description = 'Test Description'
    session.add_all(
        TodoFactory.create_batch(5, user_id=user.id, description=description)
    )
    await session.commit()

    response = client.get(
        f'/todos/?description={description}',
        headers={'Authorization': f'Bearer {token}'},
    )

    assert len(response.json()['todos']) == expect_todos


@pytest.mark.asyncio
async def test_read_todos_filter_state_should_return_5_todos(
    client, session, user, token
):
    expect_todos = 5
    state = TodoState.draft
    session.add_all(TodoFactory.create_batch(5, user_id=user.id, state=state))
    await session.commit()

    response = client.get(
        f'/todos/?state={state.value}',
        headers={'Authorization': f'Bearer {token}'},
    )

    assert len(response.json()['todos']) == expect_todos


@pytest.mark.asyncio
async def test_read_todos_filter_combined_should_return_5_todos(
    client, session, user, token
):
    expect_todos = 5

    session.add_all(
        TodoFactory.create_batch(
            5,
            user_id=user.id,
            title='Test Todo Combined',
            description='Combined Description',
            state=TodoState.done,
        )
    )

    session.add_all(
        TodoFactory.create_batch(
            3,
            user_id=user.id,
            title='Other Title',
            description='Other Description',
            state=TodoState.todo,
        )
    )

    await session.commit()

    response = client.get(
        '/todos/?title=Combined&description=Combined&state=done',
        headers={'Authorization': f'Bearer {token}'},
    )

    assert len(response.json()['todos']) == expect_todos


@pytest.mark.asyncio
async def test_read_todos_should_return_all_expected_fields(
    client, session, user, token, mock_db_time
):
    with mock_db_time(model=Todo) as time:
        todo = TodoFactory(user_id=user.id)
        session.add(todo)
        await session.commit()
        await session.refresh(todo)

        response = client.get(
            '/todos/', headers={'Authorization': f'Bearer {token}'}
        )

        assert response.json()['todos'] == [
            {
                'id': todo.id,
                'title': todo.title,
                'description': todo.description,
                'state': todo.state.value,
                'created_at': time.isoformat(),
                'updated_at': time.isoformat(),
            }
        ]


def test_patch_todo_not_found_error(client, token):
    response = client.patch(
        '/todos/-1',
        json={},
        headers={'Authorization': f'Bearer {token}'},
    )

    assert response.status_code == HTTPStatus.NOT_FOUND
    assert response.json() == {'detail': 'Todo not found.'}


@pytest.mark.asyncio
async def test_patch_todo(client, session, user, token):
    todo = TodoFactory(user_id=user.id)
    session.add(todo)
    await session.commit()
    await session.refresh(todo)

    response = client.patch(
        f'/todos/{todo.id}',
        json={'title': 'Updated Title'},
        headers={'Authorization': f'Bearer {token}'},
    )

    await session.refresh(todo)

    assert response.status_code == HTTPStatus.OK
    assert response.json() == {
        'id': todo.id,
        'title': 'Updated Title',
        'description': todo.description,
        'state': todo.state.value,
        'created_at': todo.created_at.isoformat(),
        'updated_at': todo.updated_at.isoformat(),
    }


def test_delete_todo_not_found_error(client, token):
    response = client.delete(
        '/todos/-1',
        headers={'Authorization': f'Bearer {token}'},
    )

    assert response.status_code == HTTPStatus.NOT_FOUND
    assert response.json() == {'detail': 'Todo not found.'}


@pytest.mark.asyncio
async def test_delete_todo(client, session, user, token):
    todo = TodoFactory(user_id=user.id)
    session.add(todo)
    await session.commit()
    await session.refresh(todo)

    response = client.delete(
        f'/todos/{todo.id}',
        headers={'Authorization': f'Bearer {token}'},
    )

    assert response.status_code == HTTPStatus.OK
    assert response.json() == {
        'message': 'Todo has been deleted successfully.'
    }
