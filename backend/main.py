from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, BackgroundTasks
from typing import List
from datetime import datetime
import uuid

from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .models.schemas import (
    VitalsInput,
    PatientProfile,
    Incident,
    ManualSOSInput
)
from .services import storage
from .services.notification import send_notification
from .agents.orchestrator import OrchestratorAgent
from .models.incident_state import IncidentStatus
import uuid
from backend.models.schemas import PatientCreate, PatientProfile
from backend.services.storage import Storage

storage = Storage()

app = FastAPI(title=settings.PROJECT_NAME)

# ------------ CORS ------------
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# -----------------------------

orchestrator = OrchestratorAgent()


@app.get("/")
def read_root():
    return {"message": "Multi-Agent Healthcare Companion API running"}


@app.post("/patients", response_model=PatientProfile)
def register_patient(profile: PatientCreate):
    patient_id = f"p-{uuid.uuid4().hex[:8]}"

    patient = PatientProfile(
        patient_id=patient_id,
        name=profile.name,
        age=profile.age,
        emergency_contacts=profile.emergency_contacts,
        location_lat=profile.location_lat,
        location_lon=profile.location_lon,
    )

    return storage.save_patient(patient)


def register_patient(profile: PatientProfile):
    return storage.save_patient(profile)

def register_patient(profile: PatientCreate):
    patient_id = f"p-{uuid.uuid4().hex[:8]}"

    patient = PatientProfile(
        patient_id=patient_id,
        name=profile.name,
        age=profile.age,
        emergency_contacts=profile.emergency_contacts,
        location_lat=profile.location_lat,
        location_lon=profile.location_lon,
    )

    return storage.save_patient(patient)

@app.get("/patients/{patient_id}", response_model=PatientProfile | None)
def get_patient(patient_id: str):
    return storage.get_patient(patient_id)


@app.post("/vitals")
def submit_vitals(vitals: VitalsInput, background_tasks: BackgroundTasks):
    storage.save_vitals(vitals)
    background_tasks.add_task(orchestrator.handle_new_vitals, vitals)
    return {"status": "received"}


@app.get("/incidents", response_model=List[Incident])
def get_incidents():
    return storage.list_incidents()


# ============================
# 🚨 MANUAL SOS ENDPOINT
# ============================
# @app.post("/sos/manual")
# def manual_sos(payload: ManualSOSInput):
#     """
#     Manual SOS trigger.
#     Sends SMS to EMERGENCY_PHONE from .env
#     """

#     # 1️⃣ Compose SOS message (NO vitals)
#     message = f"""
# 🚨 EMERGENCY SOS 🚨

# Patient ID: {payload.patient_id}

# The patient has manually activated
# Emergency SOS and is not feeling well.

# Immediate assistance is required.
# """

#     # 2️⃣ Send SMS (notification service reads EMERGENCY_PHONE)
#     send_notification([
#         {
#             "type": "sms",
#             "message": message
#         }
#     ])

#     # 3️⃣ Log incident
#     incident = Incident(
#         incident_id=str(uuid.uuid4()),
#         patient_id=payload.patient_id,
#         status=IncidentStatus.EMERGENCY,
#         created_at=datetime.utcnow(),
#         updated_at=datetime.utcnow(),
#         detected_pattern="MANUAL_SOS"
#     )

#     storage.create_incident(incident)

#     return {"status": "Manual SOS sent"}

@app.post("/sos/manual")
def manual_sos(payload: ManualSOSInput):
    message = f"""
🚨 EMERGENCY SOS 🚨

Patient ID: {payload.patient_id}

The patient has manually activated
Emergency SOS and is not feeling well.

Immediate assistance is required.
"""


    # 1️⃣ SEND SMS (PRIMARY GOAL)
    send_notification([
        {
            "type": "sms",
            "message": message
        }
    ])

    # 2️⃣ INCIDENT STORAGE (SECONDARY)
    try:
        incident = storage.create_incident(
            patient_id=payload.patient_id,
            detected_pattern="MANUAL_SOS"
        )

        # immediately escalate status
        storage.update_incident(
            incident.incident_id,
            status=IncidentStatus.EMERGENCY
        )
    except Exception as e:
        # Log but do NOT fail SOS
        print(f"[WARNING] Incident not stored: {e}")

    # 3️⃣ RETURN SUCCESS
    return {"status": "Manual SOS sent"}
