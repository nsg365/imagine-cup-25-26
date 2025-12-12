from fastapi import FastAPI, BackgroundTasks
from typing import List

from .config import settings
from .models.schemas import VitalsInput, PatientProfile, Incident
from .services import storage
from .agents.orchestrator import OrchestratorAgent
from fastapi import Body

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
    # handle via orchestrator in background (non-blocking)
    background_tasks.add_task(orchestrator.handle_new_vitals, vitals)
    return {"status": "received"}


@app.get("/incidents", response_model=List[Incident])
def get_incidents():
    return storage.list_incidents()


# For dev: run "uvicorn backend.main:app --reload" from project root

@app.post("/sos")
def send_sos(patient_id: str = Body(..., embed=True), background_tasks: BackgroundTasks = None):
    """
    Manual SOS trigger. Sends SOS message with latest vitals + location.
    """
    if background_tasks:
        background_tasks.add_task(orchestrator.handle_sos, patient_id)
    else:
        orchestrator.handle_sos(patient_id)

    return {"status": "SOS triggered", "patient_id": patient_id}
