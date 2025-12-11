from fastapi import FastAPI, BackgroundTasks
from typing import List

from .config import settings
from .models.schemas import VitalsInput, PatientProfile, Incident
from .services import storage
from .agents.orchestrator import OrchestratorAgent

app = FastAPI(title=settings.PROJECT_NAME)
orchestrator = OrchestratorAgent()


@app.get("/")
def read_root():
    return {"message": "Multi-Agent Healthcare Companion API running"}


@app.post("/patients", response_model=PatientProfile)
def register_patient(profile: PatientProfile):
    saved = storage.save_patient(profile)
    return saved


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
