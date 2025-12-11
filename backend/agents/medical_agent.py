from typing import Optional, List
from datetime import datetime
import uuid

from ..models.schemas import VitalsInput, MedicalRecommendation
from ..services.storage import VITALS_LOG


class MedicalRecommendationAgent:
    """
    Upgraded medical agent with:
    - Multi-signal triage logic
    - Trend detection
    - Confidence scoring
    - Explanation output
    """

    def analyze_vitals(self, vitals: VitalsInput) -> Optional[MedicalRecommendation]:
        hr = vitals.heart_rate
        spo2 = vitals.spo2
        sys = vitals.systolic_bp
        dia = vitals.diastolic_bp

        incident_id = str(uuid.uuid4())

        triage_level = 1
        likely_condition = "Normal"
        escalate = False
        patient_instructions: List[str] = []
        caregiver_instructions: List[str] = []
        explanation = []
        confidence = 0.0

        # -------------------------------
        # 1️⃣ Hypoxia Detection
        # -------------------------------
        if spo2 < 90:
            triage_level = 5
            likely_condition = "Severe hypoxia"
            escalate = True
            confidence += 0.4
            patient_instructions.append("Sit upright and breathe slowly.")
            caregiver_instructions.append("Prepare to call emergency services immediately.")
            explanation.append(f"SPO2 critically low ({spo2}%).")

        elif spo2 < 92:
            triage_level = max(triage_level, 4)
            likely_condition = "Hypoxia risk"
            confidence += 0.25
            patient_instructions.append("Try to relax and avoid exertion.")
            explanation.append(f"SPO2 low ({spo2}%).")

        elif spo2 < 94:
            triage_level = max(triage_level, 2)
            confidence += 0.1
            explanation.append(f"SPO2 slightly reduced ({spo2}%).")

        # -------------------------------
        # 2️⃣ Heart Rate Abnormalities
        # -------------------------------
        if hr > 150:
            triage_level = 5
            likely_condition = "Severe tachycardia"
            escalate = True
            confidence += 0.35
            patient_instructions.append("Sit down immediately.")
            caregiver_instructions.append("Monitor breathing.")
            explanation.append(f"Heart rate extremely high ({hr}).")

        elif hr > 130:
            triage_level = max(triage_level, 4)
            confidence += 0.25
            explanation.append(f"Heart rate very high ({hr}).")

        elif hr > 120:
            triage_level = max(triage_level, 3)
            confidence += 0.15
            explanation.append(f"Heart rate elevated ({hr}).")

        elif hr < 45:
            triage_level = max(triage_level, 4)
            confidence += 0.2
            explanation.append(f"Heart rate very low ({hr}).")

        # -------------------------------
        # 3️⃣ Fall Detection
        # -------------------------------
        if vitals.fall_flag:
            triage_level = 5
            likely_condition = "Detected fall"
            escalate = True
            confidence += 0.3
            caregiver_instructions.append("Check the patient immediately.")
            explanation.append("Fall flag detected.")

        # -------------------------------
        # 4️⃣ Trend Analysis
        # -------------------------------
        recent = [v for v in VITALS_LOG[-5:] if v.patient_id == vitals.patient_id]

        if len(recent) >= 3:
            avg_spo2 = sum(v.spo2 for v in recent) / len(recent)
            if spo2 < avg_spo2 - 3:
                triage_level = max(triage_level, 3)
                confidence += 0.15
                explanation.append("SPO2 dropping trend detected.")

            avg_hr = sum(v.heart_rate for v in recent) / len(recent)
            if hr > avg_hr + 20:
                triage_level = max(triage_level, 3)
                confidence += 0.15
                explanation.append("Heart rate spike detected.")

        # -------------------------------
        # Finalize confidence
        # -------------------------------
        confidence = min(confidence, 1.0)

        # -------------------------------
        # 5️⃣ Final Decision
        # -------------------------------
        if triage_level <= 1:
            return None

        return MedicalRecommendation(
            incident_id=incident_id,
            triage_level=triage_level,
            likely_condition=likely_condition,
            escalate_to_emergency=escalate,
            patient_instructions=patient_instructions,
            caregiver_instructions=caregiver_instructions,
            confidence=confidence,
            explanation=explanation,
        )
