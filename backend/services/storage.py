from typing import Dict, List, Optional
from datetime import datetime
from ..models.schemas import PatientProfile, Incident, VitalsInput
from ..models.incident_state import IncidentStatus
import uuid

# --------- legacy globals (DO NOT REMOVE) ----------
PATIENTS: Dict[str, PatientProfile] = {}
INCIDENTS: Dict[str, Incident] = {}
VITALS_LOG: List[VitalsInput] = []


class Storage:
    def __init__(self):
        self.PATIENTS: Dict[str, PatientProfile] = {}
        self.INCIDENTS: Dict[str, Incident] = {}
        self.VITALS_LOG: List[VitalsInput] = []

        # 🔁 bind legacy globals to instance storage
        global PATIENTS, INCIDENTS, VITALS_LOG
        PATIENTS = self.PATIENTS
        INCIDENTS = self.INCIDENTS
        VITALS_LOG = self.VITALS_LOG

    # ---------------- PATIENTS ----------------
    def save_patient(self, patient: PatientProfile) -> PatientProfile:
        self.PATIENTS[patient.patient_id] = patient
        return patient

    def get_patient(self, patient_id: str) -> Optional[PatientProfile]:
        return self.PATIENTS.get(patient_id)

    # ---------------- VITALS ----------------
    def save_vitals(self, vitals: VitalsInput) -> VitalsInput:
        self.VITALS_LOG.append(vitals)
        return vitals

    # ---------------- INCIDENTS ----------------
    def create_incident(
        self,
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

        self.INCIDENTS[incident_id] = incident
        return incident

    def update_incident(self, incident_id: str, **fields) -> Optional[Incident]:
        incident = self.INCIDENTS.get(incident_id)
        if not incident:
            return None

        data = incident.model_dump()
        data.update(fields)
        data["updated_at"] = datetime.utcnow()

        updated = Incident(**data)
        self.INCIDENTS[incident_id] = updated
        return updated

    def list_incidents(self) -> List[Incident]:
        return list(self.INCIDENTS.values())
 
    def get_latest_vitals(self, patient_id: str):
        vitals = self.vitals.get(patient_id, [])
        return vitals[-1] if vitals else None
