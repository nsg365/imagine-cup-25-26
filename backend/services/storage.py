from typing import Dict, List, Optional
from datetime import datetime
from ..models.schemas import PatientProfile, Incident, VitalsInput
from ..models.incident_state import IncidentStatus
import uuid

# In-memory stores
PATIENTS: Dict[str, PatientProfile] = {}
INCIDENTS: Dict[str, Incident] = {}
VITALS_LOG: List[VitalsInput] = []


class Storage:
    def __init__(self):
        self.patients = {}

    def save_patient(self, patient):
        self.patients[patient.patient_id] = patient
        return patient

    def get_patient(self, patient_id):
        return self.patients.get(patient_id)


def create_incident(
    patient_id: str,
    detected_pattern: str = None,
    triage_level: int = None,
    likely_condition: str = None
) -> Incident:
    incident_id = str(uuid.uuid4())
    now = datetime.utcnow()

    incident = Incident(
        incident_id=incident_id,
        patient_id=patient_id,
        status=IncidentStatus.SUSPECTED,
        created_at=now,
        updated_at=now,
        detected_pattern=detected_pattern,
        triage_level=triage_level,
        likely_condition=likely_condition
    )

    INCIDENTS[incident_id] = incident
    return incident


def get_incident(incident_id: str) -> Optional[Incident]:
    return INCIDENTS.get(incident_id)


def update_incident(incident_id: str, **fields) -> Optional[Incident]:
    incident = INCIDENTS.get(incident_id)
    if not incident:
        return None

    # Pydantic v2: use model_dump() instead of dict()
    data = incident.model_dump()
    data.update(fields)
    data["updated_at"] = datetime.utcnow()

    updated = Incident(**data)
    INCIDENTS[incident_id] = updated
    return updated


def list_incidents() -> List[Incident]:
    return list(INCIDENTS.values())
