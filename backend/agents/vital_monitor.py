from ..models.schemas import VitalsInput, VitalAnalysisResult, PatientProfile

class VitalMonitoringAgent:
    """
    Very simple rule-based anomaly detection for prototype.
    You can replace this with an ML model (LSTM, etc.).
    """

    def analyze(self, vitals: VitalsInput, patient: PatientProfile) -> VitalAnalysisResult:
        hr = vitals.heart_rate
        spo2 = vitals.spo2

        status = "NORMAL"
        pattern = None
        confidence = 0.5

        # basic heart rate rule
        if hr < patient.baseline_hr_min or hr > patient.baseline_hr_max:
            status = "WARNING"
            pattern = "hr_out_of_range"
            confidence = 0.7

        # very high hr + low spo2 -> emergency
        if hr > 130 and spo2 < 92:
            status = "EMERGENCY"
            pattern = "possible_cardiac_event"
            confidence = 0.9

        # fall detection -> warning/emergency
        if vitals.fall_flag:
            status = "EMERGENCY"
            pattern = "fall_detected"
            confidence = max(confidence, 0.9)

        return VitalAnalysisResult(
            patient_id=vitals.patient_id,
            status=status,
            detected_pattern=pattern,
            confidence=confidence,
            supporting_evidence={
                "heart_rate": hr,
                "spo2": spo2,
                "fall_flag": vitals.fall_flag
            }
        )
