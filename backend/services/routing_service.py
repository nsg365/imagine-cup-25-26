from typing import List, Dict
from math import sqrt

# simple hospital "DB"
HOSPITALS = [
    {
        "id": "H1",
        "name": "City Cardiac Center",
        "lat": 12.9716,
        "lon": 77.5946,
        "capabilities": ["cardiac", "icu"]
    },
    {
        "id": "H2",
        "name": "General Hospital",
        "lat": 12.98,
        "lon": 77.60,
        "capabilities": ["general", "icu"]
    },
]


def _distance_sq(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    return (lat1 - lat2) ** 2 + (lon1 - lon2) ** 2


def choose_hospital(lat: float, lon: float, emergency_type: str) -> Dict:
    # filter by capability first
    candidates = [h for h in HOSPITALS if emergency_type in h["capabilities"]] or HOSPITALS
    chosen = min(
        candidates,
        key=lambda h: _distance_sq(lat, lon, h["lat"], h["lon"])
    )
    # fake ETA as distance * factor
    eta = int(10 + 20 * _distance_sq(lat, lon, chosen["lat"], chosen["lon"]))
    return chosen | {"eta_minutes": max(eta, 5)}
