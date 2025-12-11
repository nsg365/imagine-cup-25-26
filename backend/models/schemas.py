from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime
from .incident_state import IncidentStatus


class VitalsInput(BaseModel):
    patient_id: str
    heart_rate: float = Field(..., gt=0)
    spo2: float = Field(..., gt=0, lt=100)
    systolic_bp: Optional[float] = None
    diastolic_bp: Optional[float] = None
    motion_flag: bool = False
    fall_flag: bool = False
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class PatientProfile(BaseModel):
    patient_id: str
    name: str
    age: int
    has_heart_disease: bool = False
    has_diabetes: bool = False
    baseline_hr_min: int = 60
    baseline_hr_max: int = 100
    emergency_contacts: List[str] = Field(default_factory=list)
    location_lat: Optional[float] = None
    location_lon: Optional[float] = None


class VitalAnalysisResult(BaseModel):
    patient_id: str
    status: str
    detected_pattern: Optional[str] = None
    confidence: float = 0.0
    supporting_evidence: Dict = Field(default_factory=dict)


class MedicalRecommendation(BaseModel):
    incident_id: str
    triage_level: int
    likely_condition: str
    escalate_to_emergency: bool
    patient_instructions: List[str]
    caregiver_instructions: List[str]


class RoutingDecision(BaseModel):
    incident_id: str
    chosen_hospital_id: str
    chosen_hospital_name: str
    eta_minutes: int
    justification: str
    route_info: Dict = Field(default_factory=dict)


class NotificationCommand(BaseModel):
    incident_id: str
    notify: List[Dict]


class Incident(BaseModel):
    incident_id: str
    patient_id: str
    status: IncidentStatus
    created_at: datetime
    updated_at: datetime
    detected_pattern: Optional[str] = None
    triage_level: Optional[int] = None
    likely_condition: Optional[str] = None
    chosen_hospital_id: Optional[str] = None
    eta_minutes: Optional[int] = None
