from typing import Optional
from datetime import datetime
from ..models.schemas import VitalsInput, MedicalRecommendation
from ..models.incident_state import IncidentStatus
import uuid


class MedicalRecommendationAgent:
    """
    A simple rule-based medical reasoning agent.
    In a real system, this would use ML or clinical decision models.
    """

    def analyze_vitals(self, vitals: VitalsInput) -> Optional[MedicalRecommendation]:
        """
        Returns a MedicalRecommendation only if something looks abnormal.
        Otherwise returns None.
        """

        incident_id = str(uuid.uuid4())

        # --- Basic rule-based triage logic ---
        hr = vitals.heart_rate
        spo2 = vitals.spo2

        # Default values
        triage_level = 1  # Normal
        likely_condition = "Normal"
        escalate = False
        patient_instructions = []
        caregiver_instructions = []

        # --- Rule 1: Low oxygen saturation ---
        if spo2 < 92:
            triage_level = 3
            likely_condition = "Possible hypoxia"
            escalate = True
            patient_instructions.append("Sit upright and stay calm.")
            caregiver_instructions.append("Prepare to contact emergency services.")

        # --- Rule 2: Very high heart rate ---
        elif hr > 120:
            triage_level = 2
            likely_condition = "Tachycardia episode"
            patient_instructions.append("Rest and avoid sudden movement.")
            caregiver_instructions.append("Monitor for chest pain or dizziness.")

        # If normal, return None → no incident
        if triage_level == 1:
            return None

        return MedicalRecommendation(
            incident_id=incident_id,
            triage_level=triage_level,
            likely_condition=likely_condition,
            escalate_to_emergency=escalate,
            patient_instructions=patient_instructions,
            caregiver_instructions=caregiver_instructions,
        )
