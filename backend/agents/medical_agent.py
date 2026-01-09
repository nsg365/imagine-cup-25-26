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

    ✔ LLM decides anomaly & reasoning
    ✔ No hardcoded medical labels
    ✔ Frontend + routing contract preserved
    ✔ Emergency + hospital cards restored
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
        # HARD SENSOR OVERRIDE (FALL)
        # --------------------------------------------------
        if vitals.fall_flag:
            return self._emit(
                incident_id=incident_id,
                triage=5,
                condition="Detected fall",
                explanation=["Fall detected by motion sensors."],
            )

        # --------------------------------------------------
        # LLM PROMPT
        # --------------------------------------------------
        prompt = f"""
You are a clinical decision-support system.
You are NOT diagnosing disease.

Respond EXACTLY in this format:

ANOMALY: yes or no
TRIAGE: number from 1 to 5
SUMMARY: short phrase explaining the abnormality

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

            raw = r.json().get("response", "")
            text = raw.lower()

            print("[MEDICAL_AGENT] LLM raw output:", raw)

            # --------------------------------------------------
            # PARSE LLM OUTPUT
            # --------------------------------------------------
            is_anomaly = "anomaly: yes" in text
            triage = self._extract_triage(text)
            summary = self._extract_summary(raw)

            # --------------------------------------------------
            # SAFETY NET (LLM UNDER-TRIAGES)
            # --------------------------------------------------
            if is_anomaly and (
                vitals.heart_rate >= 130
                or vitals.systolic_bp >= 140
                or vitals.diastolic_bp >= 90
                or vitals.spo2 <= 94
            ):
                triage = max(triage, 4)

            if not is_anomaly:
                return None

            # --------------------------------------------------
            # 🔴 CRITICAL RESTORATION LOGIC
            # --------------------------------------------------
            triage = max(1, min(triage, 5))

            escalate = triage >= 4  # ← routing trigger (unchanged elsewhere)

            return MedicalRecommendation(
                incident_id=incident_id,
                triage_level=triage,
                likely_condition=summary,
                escalate_to_emergency=escalate,
                patient_instructions=["Remain calm and avoid exertion."],
                caregiver_instructions=["Continue monitoring."],
                confidence=0.7,
                explanation=[summary],
            )

        except Exception as e:
            print("[MEDICAL_AGENT] LLM failure:", e)

        # --------------------------------------------------
        # FAIL-SAFE (FORCES ROUTING)
        # --------------------------------------------------
        return self._emit(
            incident_id=incident_id,
            triage=4,
            condition="Physiological irregularity",
            explanation=["Unable to assess reliably; emergency routing applied."],
        )

    # ==================================================
    # HELPERS
    # ==================================================

    def _emit(self, incident_id, triage, condition, explanation):
        triage = max(1, min(triage, 5))
        return MedicalRecommendation(
            incident_id=incident_id,
            triage_level=triage,
            likely_condition=condition,
            escalate_to_emergency=triage >= 4,
            patient_instructions=["Remain calm and avoid exertion."],
            caregiver_instructions=["Continue monitoring."],
            confidence=0.6,
            explanation=explanation,
        )

    def _extract_triage(self, text: str) -> int:
        match = re.search(r"triage\s*[:\-]?\s*([1-5])", text)
        if match:
            return int(match.group(1))
        return 2

    def _extract_summary(self, text: str) -> str:
        for line in text.splitlines():
            if "summary" in line.lower():
                return line.split(":", 1)[-1].strip().capitalize()
        return "Physiological anomaly"
