import time
import requests
from datetime import datetime

BASE_URL = "http://localhost:8000"


def register_patient_if_needed():
    profile = {
        "patient_id": "P123",
        "name": "Test Patient",
        "age": 65,
        "has_heart_disease": True,
        "has_diabetes": False,
        "baseline_hr_min": 60,
        "baseline_hr_max": 100,
        "emergency_contacts": ["+911234567890"],
        "location_lat": 12.9716,
        "location_lon": 77.5946
    }
    r = requests.post(f"{BASE_URL}/patients", json=profile)
    print("Register patient:", r.status_code, r.json())


def send_normal_vitals():
    payload = {
        "patient_id": "P123",
        "heart_rate": 80,
        "spo2": 98,
        "systolic_bp": 120,
        "diastolic_bp": 80,
        "motion_flag": False,
        "fall_flag": False,
        "timestamp": datetime.utcnow().isoformat()
    }
    r = requests.post(f"{BASE_URL}/vitals", json=payload)
    print("Normal vitals sent:", r.status_code, r.json())


def send_emergency_vitals():
    payload = {
        "patient_id": "P123",
        "heart_rate": 150,
        "spo2": 88,
        "systolic_bp": 150,
        "diastolic_bp": 95,
        "motion_flag": False,
        "fall_flag": False,
        "timestamp": datetime.utcnow().isoformat()
    }
    r = requests.post(f"{BASE_URL}/vitals", json=payload)
    print("Emergency vitals sent:", r.status_code, r.json())


if __name__ == "__main__":
    register_patient_if_needed()
    time.sleep(1)

    send_normal_vitals()
    time.sleep(2)

    send_emergency_vitals()
    time.sleep(2)

    incidents = requests.get(f"{BASE_URL}/incidents").json()
    print("Incidents:", incidents)
