from typing import Dict, List
from datetime import datetime
from ..models.schemas import PatientProfile, Incident, VitalsInput
from ..models.incident_state import IncidentStatus

# In-memory stores
PATIENTS: Dict[str, PatientProfile] = {}
INCIDENTS: Dict[str, Incident] = {}
VITALS_LOG: List[VitalsInput] = []


def save_patient(profile: PatientProfile):
    PATIENTS[profile.patient_id] = profile
    return profile


def get_patient(patient_id: str) -> PatientProfile | None:
    return PATIENTS.get(patient_id)


def save_vitals(v: VitalsInput):
    VITALS_LOG.append(v)
    return v


def create_incident(incident: Incident):
    INCIDENTS[incident.incident_id] = incident
    return incident


def update_incident(incident_id: str, **fields):
    incident = INCIDENTS.get(incident_id)
    if not incident:
        return None
    updated = incident.copy(update={**fields, "updated_at": datetime.utcnow()})
    INCIDENTS[incident_id] = updated
    return updated


def list_incidents() -> list[Incident]:
    return list(INCIDENTS.values())
