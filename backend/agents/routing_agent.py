import googlemaps
from datetime import datetime
from typing import List, Dict
from ..models.schemas import PatientProfile, MedicalRecommendation, RoutingDecision
from ..config import settings


class RoutingAgent:
    """
    Smart Routing Agent — Option B:
    - Fetches REAL hospitals near the patient using Google Places API
    - Computes ETA using Google Distance Matrix API
    - Prioritizes BIG hospitals first (rating-based)
    - Selects the best option using a scoring formula
    """

    def __init__(self):
        self.gmaps = googlemaps.Client(key=settings.MAPS_API_KEY)

    # ----------------------------------------------------------------------
    # 1️⃣ FIND REAL HOSPITALS NEAR THE PATIENT (Google Places)
    # ----------------------------------------------------------------------
    def find_nearby_hospitals(self, patient: PatientProfile) -> List[Dict]:
        location = (patient.location_lat, patient.location_lon)

        results = self.gmaps.places_nearby(
            location=location,
            radius=5000,     # 5km search radius
            type="hospital"
        )

        hospitals = []
        for place in results.get("results", []):
            hospitals.append({
                "id": place["place_id"],
                "name": place["name"],
                "lat": place["geometry"]["location"]["lat"],
                "lon": place["geometry"]["location"]["lng"],
                "address": place.get("vicinity"),
                "rating": place.get("rating", 3.5),
                "reviews": place.get("user_ratings_total", 50),
            })

        return hospitals

    # ----------------------------------------------------------------------
    # 2️⃣ COMPUTE ETA USING GOOGLE DISTANCE MATRIX
    # ----------------------------------------------------------------------
    def compute_eta(self, patient: PatientProfile, hospital: Dict) -> int:
        origin = (patient.location_lat, patient.location_lon)
        destination = (hospital["lat"], hospital["lon"])

        result = self.gmaps.distance_matrix(
            origins=[origin],
            destinations=[destination],
            mode="driving",
            departure_time=datetime.now()
        )

        element = result["rows"][0]["elements"][0]

        if element.get("status") != "OK":
            return 999  # unreachable hospital fallback

        eta_seconds = element["duration"]["value"]
        return int(eta_seconds / 60)

    # ----------------------------------------------------------------------
    # 3️⃣ SELECT BEST HOSPITAL (Rating-first scoring)
    # ----------------------------------------------------------------------
    def choose_hospital(self, patient: PatientProfile, rec: MedicalRecommendation) -> RoutingDecision:
        condition = rec.likely_condition.lower()

        print("\n[ROUTING] Fetching nearby hospitals from Google...")
        hospitals = self.find_nearby_hospitals(patient)

        if not hospitals:
            print("[ROUTING] ERROR: No hospitals found nearby.")
            return RoutingDecision(
                incident_id=rec.incident_id,
                chosen_hospital_id="NONE",
                chosen_hospital_name="No Hospital Found",
                eta_minutes=999,
                justification="No hospitals found via Google Places API.",
                route_info={}
            )

        print(f"[ROUTING] Found {len(hospitals)} hospitals nearby.")

        scored = []
        for h in hospitals:
            eta = self.compute_eta(patient, h)
            rating = h.get("rating", 3.5)
            reviews = h.get("reviews", 100)

            # ⭐ NEW: Big-hospital scoring system
            score = 0
            score += rating * 2.0                # BIGGEST impact → big hospitals first
            score += max(0, 5 - eta / 10)        # prefer closer hospitals
            score += reviews / 10000             # slight boost for very popular hospitals

            scored.append((score, h, eta))

        # pick best hospital
        best = max(scored, key=lambda x: x[0])
        score, hospital, eta = best

        print(f"[ROUTING] Selected: {hospital['name']} | ETA: {eta} mins | Rating: {hospital.get('rating')}")

        return RoutingDecision(
            incident_id=rec.incident_id,
            chosen_hospital_id=hospital["id"],
            chosen_hospital_name=hospital["name"],
            eta_minutes=eta,
            justification=(
                f"Chosen based on rating={hospital.get('rating')} (priority), "
                f"reviews={hospital.get('reviews')}, ETA={eta} mins."
            ),
            route_info={
                "lat": hospital["lat"],
                "lon": hospital["lon"],
                "address": hospital.get("address"),
                "rating": hospital.get("rating"),
                "reviews": hospital.get("reviews"),
            }
        )
