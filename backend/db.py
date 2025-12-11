from sqlmodel import SQLModel, create_engine, Session
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite+aiosqlite:///./imaginecup.db"

# Async engine & session factory
async_engine = create_async_engine(DATABASE_URL, echo=False, future=True)
async_session = sessionmaker(async_engine, class_=AsyncSession, expire_on_commit=False)

def get_sync_engine():
    # For quick sync helpers (optional)
    return create_engine("sqlite:///./imaginecup.db", echo=False, future=True)

async def init_db():
    # Create tables (sync via SQLModel metadata on async engine)
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
