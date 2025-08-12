from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from projeto_api.settings import Settings

engine = create_engine(Settings().DATABASE_URL)


# Injeção de Dependência -> Depends
def get_session():
    with Session(engine) as session:  # session = Session(engine)
        yield session
