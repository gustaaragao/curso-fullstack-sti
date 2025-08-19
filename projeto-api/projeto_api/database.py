from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

from projeto_api.settings import Settings

engine = create_async_engine(Settings().DATABASE_URL)


# Injeção de Dependência -> Depends
async def get_session():
    async with AsyncSession(engine, expire_on_commit=False) as session:
        # session = Session(engine)
        yield session
