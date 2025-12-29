from ..models.schemas import VitalsInput, PatientProfile
from ..services import storage
from ..services.notification import send_notification
from .medical_agent import MedicalRecommendationAgent
from .notification_agent import NotificationAgent
from .routing_agent import RoutingAgent


class OrchestratorAgent:
    """
    Main multi-agent coordinator:
    - Accepts new vitals
    - Runs medical analysis
    - Creates / updates incidents
    - Routes patient if needed
    - Sends automatic emergency SMS
    - Handles manual SOS
    """

    def __init__(self):
        self.med_agent = MedicalRecommendationAgent()
        self.notify_agent = NotificationAgent()
        self.routing_agent = RoutingAgent()

    # ======================================================
    # 🚨 AUTOMATIC EMERGENCY SMS (ANOMALOUS VITALS)
    # ======================================================
    def _send_emergency_sms(self, patient, vitals, rec, incident, routing):
        bp = "N/A"
        if vitals.systolic_bp and vitals.diastolic_bp:
            bp = f"{vitals.systolic_bp}/{vitals.diastolic_bp}"

        message = f"""
🚨 AUTOMATIC MEDICAL EMERGENCY 🚨

Patient ID: {patient.patient_id}
Age: {patient.age}

Detected Condition:
{rec.likely_condition}

Triage Level: {rec.triage_level}
Confidence: {rec.confidence:.2f}

Vitals:
• Heart Rate: {vitals.heart_rate} bpm
• SpO₂: {vitals.spo2} %
• BP: {bp}
• Fall Detected: {vitals.fall_flag}
"""

        if routing:
            message += f"""
Nearest Hospital:
{routing.chosen_hospital_name}
ETA: {routing.eta_minutes} minutes
"""

        message += "\nImmediate medical attention is required."

        send_notification([
            {
                "type": "sms",
                "message": message
            }
        ])

    # ======================================================
    # 📡 HANDLE NEW VITALS (BACKGROUND TASK)
    # ======================================================
    async def handle_new_vitals(self, vitals: VitalsInput):

        print("\n[ORCHESTRATOR] Received vitals:", vitals.model_dump())

        # 1️⃣ Medical analysis
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

        # 2️⃣ Load patient
        patient = storage.get_patient(vitals.patient_id)
        if not patient:
            print("[ORCHESTRATOR] ERROR: Patient record not found.")
            return

        # 3️⃣ Create incident
        incident = storage.create_incident(
            patient_id=vitals.patient_id,
            detected_pattern=rec.likely_condition,
            triage_level=rec.triage_level,
            likely_condition=rec.likely_condition,
        )

        print("[ORCHESTRATOR] Incident created:", incident.incident_id)

        # 4️⃣ Routing + automatic SMS (if emergency)
        routing = None
        if rec.escalate_to_emergency:
            routing = self.routing_agent.choose_hospital(patient, rec)

            print("[ORCHESTRATOR] Routing decision:", routing)

            storage.update_incident(
                incident_id=incident.incident_id,
                chosen_hospital_id=routing.chosen_hospital_id,
                chosen_hospital_name=routing.chosen_hospital_name,
                eta_minutes=routing.eta_minutes,
                route_info=routing.route_info,
            )

            # 🚨 AUTO SMS TRIGGER
            self._send_emergency_sms(
                patient=patient,
                vitals=vitals,
                rec=rec,
                incident=incident,
                routing=routing
            )

        # 5️⃣ Structured notifications (dashboard / logs)
        notify_cmd = self.notify_agent.build_and_send(rec, routing, patient)

        print("[ORCHESTRATOR] Notifications sent:")
        for n in notify_cmd.notify:
            print("   >", n)

        # 6️⃣ Final summary (for demo / judges)
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

    # ======================================================
    # 🆘 MANUAL SOS (BUTTON TRIGGERED)
    # ======================================================
    def handle_sos(self, patient_id: str, vitals_snapshot: dict | None = None):

        # 1️⃣ Fetch patient
        patient = storage.get_patient(patient_id)
        if not patient:
            print(f"[SOS] No profile for {patient_id}")
            return None

        # 2️⃣ Use last known vitals if not provided
        if not vitals_snapshot:
            last = None
            for v in reversed(storage.VITALS_LOG):
                if v.patient_id == patient_id:
                    last = v
                    break

            vitals_snapshot = {}
            if last:
                vitals_snapshot = {
                    "heart_rate": last.heart_rate,
                    "spo2": last.spo2,
                    "systolic_bp": last.systolic_bp,
                    "diastolic_bp": last.diastolic_bp,
                    "fall_flag": last.fall_flag
                }

        # 3️⃣ Optional routing
        routing = None
        if patient.location_lat and patient.location_lon:
            try:
                routing = self.routing_agent.decide(
                    incident_id="sos-" + patient_id,
                    lat=patient.location_lat,
                    lon=patient.location_lon,
                    emergency_type="medical"
                )
            except Exception as e:
                print(f"[SOS] Routing error: {e}")

        # 4️⃣ Send SOS notifications
        notif = self.notify_agent.send_sos(
            patient=patient,
            vitals_snapshot=vitals_snapshot,
            routing=routing,
            incident_id="sos-" + patient_id
        )

        print(f"[SOS] Notifications sent for {patient_id}")
        return notif
