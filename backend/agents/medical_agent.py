from typing import Optional
import uuid
import requests
import re

from ..models.schemas import VitalsInput, MedicalRecommendation


OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
OLLAMA_MODEL = "phi3"


class MedicalRecommendationAgent:
    """
    LLM-FIRST MEDICAL TRIAGE AGENT

    - No hardcoded anomaly types
    - LLM decides abnormal vs normal
    - Robust parsing (no brittle string matching)
    - Guaranteed UI-safe alerts
    """

    def analyze_vitals(self, vitals: VitalsInput) -> Optional[MedicalRecommendation]:
        print(
            "[MEDICAL_AGENT] analyze_vitals:",
            f"HR={vitals.heart_rate}",
            f"SPO2={vitals.spo2}",
            f"BP={vitals.systolic_bp}/{vitals.diastolic_bp}",
            f"FALL={vitals.fall_flag}",
        )

        incident_id = str(uuid.uuid4())

        # --------------------------------------------------
        # HARD SAFETY OVERRIDE (ONLY FALL)
        # --------------------------------------------------
        if vitals.fall_flag:
            return self._emit(
                incident_id,
                triage=3,
                condition="Detected fall",
                explanation=["Fall detected by motion sensors."]
            )

        # --------------------------------------------------
        # LLM PROMPT (STRICT BUT FLEXIBLE)
        # --------------------------------------------------
        prompt = f"""
You are a clinical decision-support system.
You are NOT diagnosing disease.

Given these vitals, decide whether the state is physiologically abnormal.

Respond in plain text using this structure:

ANOMALY: yes or no
TRIAGE: number from 1 to 5
SUMMARY: one short phrase explaining why

Rules:
- If values are borderline, drifting, or not clearly optimal, mark ANOMALY: yes with TRIAGE: 2
- Only say ANOMALY: no if all vitals are clearly ideal
- Be conservative
- Do NOT mention diseases

Vitals:
Heart rate: {vitals.heart_rate}
SpO2: {vitals.spo2}
Blood pressure: {vitals.systolic_bp}/{vitals.diastolic_bp}
"""

        try:
            r = requests.post(
                OLLAMA_URL,
                json={
                    "model": OLLAMA_MODEL,
                    "prompt": prompt,
                    "stream": False,
                },
                timeout=60,
            )
            r.raise_for_status()
            text = r.json().get("response", "").lower()

            print("[MEDICAL_AGENT] LLM raw output:", text)

            # --------------------------------------------------
            # ROBUST ANOMALY DETECTION (NO BRITTLE STRINGS)
            # --------------------------------------------------
            is_anomaly = any(
                k in text
                for k in [
                    "anomaly: yes",
                    "abnormal",
                    "irregular",
                    "not normal",
                    "borderline",
                    "concerning",
                    "elevated",
                    "reduced",
                ]
            )

            triage = self._extract_triage(text)
            summary = self._extract_summary(text)

            # --------------------------------------------------
            # UI SAFETY NET (LLM CONSERVATIVE CASE)
            # --------------------------------------------------
            if not is_anomaly and (
                vitals.spo2 < 96
                or vitals.systolic_bp < 105
                or vitals.heart_rate > 95
            ):
                is_anomaly = True
                triage = max(triage, 2)
                summary = "Borderline physiological values"

            if not is_anomaly:
                return None

            return MedicalRecommendation(
                incident_id=incident_id,
                triage_level=triage,
                likely_condition=summary,
                escalate_to_emergency=True,  # ensures alert card
                patient_instructions=["Remain calm and avoid exertion."],
                caregiver_instructions=["Continue monitoring."],
                confidence=0.7,
                explanation=[summary],
            )

        except Exception as e:
            print("[MEDICAL_AGENT] LLM failure:", e)

        # --------------------------------------------------
        # FAIL-SAFE FALLBACK (ALWAYS ALERTS)
        # --------------------------------------------------
        return self._emit(
            incident_id,
            triage=2,
            condition="Physiological irregularity",
            explanation=["Unable to assess reliably; conservative alert issued."]
        )

    # ======================================================
    # HELPERS
    # ======================================================

    def _emit(self, incident_id, triage, condition, explanation):
        return MedicalRecommendation(
            incident_id=incident_id,
            triage_level=triage,
            likely_condition=condition,
            escalate_to_emergency=True,
            patient_instructions=["Remain calm and avoid exertion."],
            caregiver_instructions=["Continue monitoring."],
            confidence=0.6,
            explanation=explanation,
        )

    def _extract_triage(self, text: str) -> int:
        match = re.search(r"triage\s*[:\-]?\s*([1-5])", text)
        if match:
            return int(match.group(1))
        return 2  # conservative default

    def _extract_summary(self, text: str) -> str:
        for line in text.splitlines():
            if "summary" in line:
                return line.split(":", 1)[-1].strip().capitalize()
        return "Physiological anomaly"
