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
