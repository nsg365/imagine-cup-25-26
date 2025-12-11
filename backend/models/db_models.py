from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
import uuid

class Patient(SQLModel, table=True):
    patient_id: str = Field(primary_key=True, index=True)
    name: str
    age: int
    has_heart_disease: bool = False
    has_diabetes: bool = False
    baseline_hr_min: int = 60
    baseline_hr_max: int = 100
    location_lat: Optional[float] = None
    location_lon: Optional[float] = None

class Vitals(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: str = Field(index=True)
    heart_rate: float
    spo2: float
    systolic_bp: Optional[float] = None
    diastolic_bp: Optional[float] = None
    motion_flag: bool = False
    fall_flag: bool = False
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Incident(SQLModel, table=True):
    incident_id: str = Field(primary_key=True, default_factory=lambda: str(uuid.uuid4()))
    patient_id: str = Field(index=True)
    status: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    detected_pattern: Optional[str] = None
    triage_level: Optional[int] = None
    likely_condition: Optional[str] = None
    chosen_hospital_id: Optional[str] = None
    eta_minutes: Optional[int] = None
    explanation: Optional[str] = None
    confidence: Optional[float] = None
