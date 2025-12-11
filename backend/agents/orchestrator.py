import uuid
from datetime import datetime
from typing import Optional

from ..models.schemas import (
    VitalsInput, VitalAnalysisResult, MedicalRecommendation,
    RoutingDecision, Incident
)
from ..models.incident_state import IncidentStatus
from ..services import storage
from .vital_monitor import VitalMonitoringAgent
from .medical_agent import MedicalRecommendationAgent
from .routing_agent import RoutingAgent
from .notification_agent import NotificationAgent


class OrchestratorAgent:
    def __init__(self):
        self.vital_agent = VitalMonitoringAgent()
        self.medical_agent = MedicalRecommendationAgent()
        self.routing_agent = RoutingAgent()
        self.notification_agent = NotificationAgent()

    def handle_new_vitals(self, vitals: VitalsInput):
        # 1. Store vitals
        storage.save_vitals(vitals)

        # 2. Fetch patient profile
        patient = storage.get_patient(vitals.patient_id)
        if not patient:
            print(f"[WARN] No patient profile for {vitals.patient_id}, skipping.")
            return

        # 3. Analyze vitals
        analysis: VitalAnalysisResult = self.vital_agent.analyze(vitals, patient)

        if analysis.status == "NORMAL":
            print(f"[INFO] Patient {vitals.patient_id} vitals normal.")
            return

        # 4. Create incident
        incident_id = str(uuid.uuid4())
        incident = Incident(
            incident_id=incident_id,
            patient_id=vitals.patient_id,
            status=IncidentStatus.SUSPECTED,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            detected_pattern=analysis.detected_pattern
        )
        storage.create_incident(incident)

        # 5. Medical recommendation
        recommendation: MedicalRecommendation = self.medical_agent.recommend(
            incident_id=incident_id,
            analysis=analysis,
            patient=patient
        )

        # update incident with triage info
        storage.update_incident(
            incident_id,
            status=IncidentStatus.CONFIRMED_EMERGENCY
            if recommendation.escalate_to_emergency
            else IncidentStatus.SUSPECTED,
            triage_level=recommendation.triage_level,
            likely_condition=recommendation.likely_condition
        )

        # 6. Routing (only if escalate_to_emergency and patient has location)
        routing: Optional[RoutingDecision] = None
        if recommendation.escalate_to_emergency and patient.location_lat and patient.location_lon:
            routing = self.routing_agent.decide(
                incident_id=incident_id,
                lat=patient.location_lat,
                lon=patient.location_lon,
                emergency_type="cardiac"  # for now; in future map from condition
            )
            storage.update_incident(
                incident_id,
                chosen_hospital_id=routing.chosen_hospital_id,
                eta_minutes=routing.eta_minutes
            )

        # 7. Notification
        notif_cmd = self.notification_agent.build_and_send(
            rec=recommendation,
            routing=routing,
            patient=patient
        )

        storage.update_incident(
            incident_id,
            status=IncidentStatus.NOTIFICATIONS_SENT
        )

        print(f"[ORCH] Incident {incident_id} processed. Notifications: {len(notif_cmd.notify)}")
