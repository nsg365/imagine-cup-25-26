from ..models.schemas import RoutingDecision
from ..services.routing_service import choose_hospital

class RoutingAgent:
    def decide(self, incident_id: str, lat: float, lon: float, emergency_type: str) -> RoutingDecision:
        hosp = choose_hospital(lat, lon, emergency_type)
        return RoutingDecision(
            incident_id=incident_id,
            chosen_hospital_id=hosp["id"],
            chosen_hospital_name=hosp["name"],
            eta_minutes=hosp["eta_minutes"],
            justification=f"Closest {emergency_type} capable hospital.",
            route_info={
                "start_lat": lat,
                "start_lon": lon,
                "end_lat": hosp["lat"],
                "end_lon": hosp["lon"],
            }
        )
