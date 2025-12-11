from ..models.schemas import VitalsInput, PatientProfile
from ..services import storage
from .medical_agent import MedicalRecommendationAgent
from .notification_agent import NotificationAgent
from .routing_agent import RoutingAgent  # you have this file already, we’ll adjust later

class OrchestratorAgent:
    """
    Main multi-agent coordinator:
    - Accepts new vitals
    - Runs medical analysis
    - Creates / updates incidents
    - Routes patient if needed
    - Notifies patient + caregivers + hospitals
    """

    def __init__(self):
        self.med_agent = MedicalRecommendationAgent()
        self.notify_agent = NotificationAgent()
        self.routing_agent = RoutingAgent()

    async def handle_new_vitals(self, vitals: VitalsInput):
        """
        Called in background when new vitals are sent.
        """

        print("\n[ORCHESTRATOR] Received vitals:", vitals.model_dump())

        # -------------------------------
        # 1️⃣ Medical Analysis
        # -------------------------------
        rec = self.med_agent.analyze_vitals(vitals)

        if not rec:
            print("[ORCHESTRATOR] No medical alert triggered.")
            return

        print("[ORCHESTRATOR] Medical alert triggered!")
        print(" - Likely condition:", rec.likely_condition)
        print(" - Triage level:", rec.triage_level)
        print(" - Confidence:", rec.confidence)
        print(" - Explanation:")
        for x in rec.explanation:
            print("    •", x)

        # -------------------------------
        # 2️⃣ Load patient profile
        # -------------------------------
        patient = storage.get_patient(vitals.patient_id)
        if not patient:
            print("[ORCHESTRATOR] ERROR: Patient record not found.")
            return

        # -------------------------------
        # 3️⃣ Create Incident
        # -------------------------------
        incident = storage.create_incident(
            patient_id=vitals.patient_id,
            detected_pattern=rec.likely_condition,
            triage_level=rec.triage_level,
            likely_condition=rec.likely_condition,
        )

        print("[ORCHESTRATOR] Incident created:", incident.incident_id)

        # -------------------------------
        # 4️⃣ Routing (if emergency level)
        # -------------------------------
        routing = None
        if rec.escalate_to_emergency:
            routing = self.routing_agent.choose_hospital(patient, rec)
            print("[ORCHESTRATOR] Routing decision:", routing)

            storage.update_incident(
                incident_id=incident.incident_id,
                chosen_hospital_id=routing.chosen_hospital_id,
                eta_minutes=routing.eta_minutes,
            )

        # -------------------------------
        # 5️⃣ Notifications
        # -------------------------------
        notify_cmd = self.notify_agent.build_and_send(rec, routing, patient)

        print("[ORCHESTRATOR] Notifications sent:")
        for n in notify_cmd.notify:
            print("   >", n)

        # -------------------------------
        # 6️⃣ Final log for judges/demo
        # -------------------------------
        print("\n🎯 INCIDENT SUMMARY")
        print("- Incident ID:", incident.incident_id)
        print("- Condition:", rec.likely_condition)
        print("- Triage Level:", rec.triage_level)
        print("- Confidence:", rec.confidence)
        if routing:
            print("- Routed to:", routing.chosen_hospital_name)
            print("- ETA:", routing.eta_minutes, "mins")
        print("- Explanation:", rec.explanation)
        print("----------------------------------------------------\n")
