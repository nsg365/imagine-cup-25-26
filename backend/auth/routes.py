from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from .auth_db import get_user, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    patient_id: str
    password: str


@router.post("/login")
def login(payload: LoginRequest):
    user = get_user(payload.patient_id)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid patient ID or password")

    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid patient ID or password")

    return {
        "status": "success",
        "patient_id": payload.patient_id
    }
