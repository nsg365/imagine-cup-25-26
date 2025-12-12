from ..models.schemas import NotificationCommand, MedicalRecommendation, RoutingDecision, PatientProfile
from ..services.notification import send_notification

class NotificationAgent:
    def build_and_send(self, rec: MedicalRecommendation, routing: RoutingDecision | None, patient: PatientProfile) -> NotificationCommand:
        commands = []

        # patient notification
        commands.append({
            "type": "push",
            "to": patient.patient_id,
            "message": f"ALERT: {rec.likely_condition.upper()} (triage {rec.triage_level}). "
                       f"Instructions: " + " ".join(rec.patient_instructions)
        })

        # family / caregivers
        for contact in patient.emergency_contacts:
            msg = f"Emergency alert for {patient.name}. Likely: {rec.likely_condition}. "
            if routing:
                msg += f"Suggested hospital: {routing.chosen_hospital_name}, ETA ~{routing.eta_minutes} mins."
            commands.append({
                "type": "sms",
                "to": contact,
                "message": msg
            })

        # hospital (if routing available)
        if routing:
            commands.append({
                "type": "webhook",
                "to": routing.chosen_hospital_id,
                "message": f"Incoming emergency: {rec.likely_condition}, triage {rec.triage_level}, ETA {routing.eta_minutes} mins."
            })

        # send via service
        send_notification(commands)

        return NotificationCommand(
            incident_id=rec.incident_id,
            notify=commands
        )
    
    def send_sos(self, patient: PatientProfile, vitals_snapshot: dict, routing: RoutingDecision | None = None, incident_id: str | None = None):
        from datetime import datetime
        from urllib.parse import quote_plus

        # ---- Build vitals summary ----
        vitals_txt = []
        if "heart_rate" in vitals_snapshot:
            vitals_txt.append(f"HR: {vitals_snapshot['heart_rate']} bpm")
        if "spo2" in vitals_snapshot:
            vitals_txt.append(f"SpO₂: {vitals_snapshot['spo2']}%")
        if "systolic_bp" in vitals_snapshot and "diastolic_bp" in vitals_snapshot:
            vitals_txt.append(f"BP: {vitals_snapshot['systolic_bp']}/{vitals_snapshot['diastolic_bp']} mmHg")
        if vitals_snapshot.get("fall_flag"):
            vitals_txt.append("Fall detected")

        vitals_summary = " • ".join(vitals_txt) if vitals_txt else "No vitals available"

        # ---- Location Link ----
        map_link = None
        if patient.location_lat and patient.location_lon:
            q = quote_plus(f"{patient.location_lat},{patient.location_lon}")
            map_link = f"https://www.google.com/maps/search/?api=1&query={q}"

        # ---- Base SOS message ----
        msg = f"""
🚨 SOS ALERT 🚨
Patient: {patient.name} (ID: {patient.patient_id})

Vitals:
{vitals_summary}
""".strip()

        if map_link:
            msg += f"\nLocation:\n{map_link}"

        if routing:
            msg += f"\nSuggested Hospital:\n{routing.chosen_hospital_name} (ETA ~{routing.eta_minutes} mins)"

        msg += f"\nTime: {datetime.utcnow().isoformat()}Z\nIncident ID: {incident_id or 'manual-sos'}"

        # Notification Commands
        commands = []

        # Push notification to patient device
        commands.append({"type": "push", "to": patient.patient_id, "message": msg})

        # Send SMS to all emergency contacts
        for contact in patient.emergency_contacts:
            commands.append({"type": "sms", "to": contact, "message": msg})

        # Optional webhook to hospital
        if routing:
            commands.append({"type": "webhook", "to": routing.chosen_hospital_id, "message": msg})

        # Send notifications
        send_notification(commands)

        return NotificationCommand(
            incident_id=incident_id or "manual-sos",
            notify=commands
        )
