from pydantic import BaseModel

class LoginRequest(BaseModel):
    patient_id: str
    password: str

class LoginResponse(BaseModel):
    patient_id: str
    message: str
