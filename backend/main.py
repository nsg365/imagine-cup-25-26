from dotenv import load_dotenv
import os
load_dotenv()

from .auth.routes import router as auth_router
from .auth.auth_db import init_auth_db, store_user_credentials
from .services.auth_storage import store_password
from .auth.auth_db import init_auth_db
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from datetime import datetime
import uuid

from .config import settings
from .models.schemas import (
    VitalsInput,
    PatientProfile,
    PatientCreate,
    Incident,
    ManualSOSInput
)
from .models.incident_state import IncidentStatus
from .services.storage import Storage
from .services.notification import send_notification
from .agents.orchestrator import OrchestratorAgent

# -----------------------------
# APP INIT
# -----------------------------
app = FastAPI(title=settings.PROJECT_NAME)

init_auth_db()
app.include_router(auth_router)



storage = Storage()
orchestrator = OrchestratorAgent(storage)


# -----------------------------
# CORS
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# ROOT
# -----------------------------
@app.get("/")
def read_root():
    return {"message": "Multi-Agent Healthcare Companion API running"}

# =============================
# 👤 PATIENT REGISTRATION
# =============================
@app.post("/patients", response_model=PatientProfile)
def register_patient(payload: PatientCreate):
    patient_id = f"p-{uuid.uuid4().hex[:8]}"

    patient = PatientProfile(
        patient_id=patient_id,
        name=payload.name,
        age=payload.age,
        emergency_contacts=payload.emergency_contacts,
        location_lat=payload.location_lat,
        location_lon=payload.location_lon,
        has_heart_disease=payload.has_heart_disease,
        has_diabetes=payload.has_diabetes,
        baseline_hr_min=payload.baseline_hr_min,
        baseline_hr_max=payload.baseline_hr_max,
    )

    # 1️⃣ Store patient profile (memory for now)
    storage.save_patient(patient)

    # 2️⃣ Store credentials (SQLite)
    store_user_credentials(
        patient_id=patient_id,
        password=payload.password
    )

    return patient


# =============================
# 👤 GET PATIENT
# =============================
@app.get("/patients/{patient_id}", response_model=PatientProfile | None)
def get_patient(patient_id: str):
    return storage.get_patient(patient_id)

# =============================
# ❤️ VITALS INGESTION
# =============================
@app.post("/vitals")
def submit_vitals(vitals: VitalsInput, background_tasks: BackgroundTasks):
    storage.save_vitals(vitals)
    background_tasks.add_task(orchestrator.handle_new_vitals, vitals)
    return {"status": "received"}

# =============================
# 🚨 INCIDENTS
# =============================
@app.get("/incidents", response_model=List[Incident])
def get_incidents():
    return storage.list_incidents()

@app.get("/vitals/{patient_id}")
def get_latest_vitals(patient_id: str):
    vitals = storage.get_latest_vitals(patient_id)
    if not vitals:
        return None
    return vitals



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

    # 1️⃣ Fetch patient
    patient = storage.get_patient(payload.patient_id)
    if not patient:
        return {"error": "Patient not found"}

    # 2️⃣ Compose SOS message (use NAME, not ID)
    message = f"""
🚨 EMERGENCY SOS 🚨

Patient: {patient.name}

The patient has manually activated
Emergency SOS and is not feeling well.

Immediate assistance is required.
""".strip()

    # 3️⃣ Send notification (DO NOT FAIL SOS)
    try:
        send_notification([
            {
                "type": "sms",
                "message": message
            }
        ])
    except Exception as e:
        print(f"[WARNING] Notification failed: {e}")

    # 4️⃣ Store incident (best-effort)
    try:
        incident = storage.create_incident(
            patient_id=payload.patient_id,
            detected_pattern="MANUAL_SOS"
        )

        storage.update_incident(
            incident.incident_id,
            status=IncidentStatus.EMERGENCY
        )
    except Exception as e:
        print(f"[WARNING] Incident not stored: {e}")

    return {"status": "Manual SOS sent"}




