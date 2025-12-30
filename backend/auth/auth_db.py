from sqlalchemy import Column, String, DateTime, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime
import hashlib

from passlib.context import CryptContext

DATABASE_URL = "sqlite:///backend/auth/auth.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# ---------------------------
# AUTH TABLE
# ---------------------------
class AuthUser(Base):
    __tablename__ = "auth_users"

    patient_id = Column(String, primary_key=True, index=True)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


# ---------------------------
# HELPERS
# ---------------------------
def _prehash(password: str) -> str:
    """Allow arbitrarily long passwords"""
    return hashlib.sha256(password.encode()).hexdigest()


def hash_password(password: str) -> str:
    return pwd_context.hash(_prehash(password))


def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(_prehash(password), hashed)


# ---------------------------
# DB OPS
# ---------------------------
def init_auth_db():
    Base.metadata.create_all(bind=engine)


def store_user_credentials(patient_id: str, password: str):
    db = SessionLocal()
    try:
        user = AuthUser(
            patient_id=patient_id,
            password_hash=hash_password(password)
        )
        db.add(user)
        db.commit()
    finally:
        db.close()


def get_user(patient_id: str):
    db = SessionLocal()
    try:
        return db.query(AuthUser).filter(
            AuthUser.patient_id == patient_id
        ).first()
    finally:
        db.close()
