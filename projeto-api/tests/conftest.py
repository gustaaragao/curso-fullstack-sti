from contextlib import contextmanager
from datetime import datetime

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import StaticPool, create_engine, event
from sqlalchemy.orm import Session

from projeto_api.app import app
from projeto_api.database import get_session
from projeto_api.models import User, table_registry


@pytest.fixture
def client(session):
    def get_session_override():
        return session

    with TestClient(app) as client:
        # Adiciona no lugar a fixture de session
        app.dependency_overrides[get_session] = get_session_override
        yield client

    # Limpa a sobrescrita que fizemos no app para usar a fixture de session.
    app.dependency_overrides.clear()


@pytest.fixture
def session():
    engine = create_engine(
        'sqlite:///:memory:',
        connect_args={'check_same_thread': False},
        poolclass=StaticPool,
    )
    table_registry.metadata.create_all(engine)

    with Session(engine) as session:
        yield session

    table_registry.metadata.drop_all(engine)


@contextmanager  # Cria um gerenciador de contexto (with)
# * garante que todos os parâmetros sejam chamados de forma explícita
def _mock_db_time(*, model, time=datetime(2024, 1, 1)):
    # hook(mapper, connection, target)
    def fake_time_hook(mapper, connection, target):
        if hasattr(target, 'created_at'):
            target.created_at = time
        if hasattr(target, 'updated_at'):
            target.updated_at = time

    event.listen(model, 'before_insert', fake_time_hook)

    yield time

    event.remove(model, 'before_insert', fake_time_hook)


@pytest.fixture
def mock_db_time():
    return _mock_db_time


@pytest.fixture
def user(session):
    user = User(username='test', email='test@email.com', password='secret')

    session.add(user)
    session.commit()
    session.refresh(user)

    return user
