from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# patient_id → password_hash
AUTH_DB = {}

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)

def store_password(patient_id: str, password: str):
    AUTH_DB[patient_id] = hash_password(password)

def check_password(patient_id: str, password: str) -> bool:
    hashed = AUTH_DB.get(patient_id)
    if not hashed:
        return False
    return verify_password(password, hashed)
