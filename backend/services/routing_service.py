from ..services.routing_service import RoutingService


class RoutingAgent:

    def find_nearby_hospitals(self, patient):
        """
        Get hospitals near the patient's LAST known location.
        If patient has no location → use fallback.
        """

        user_lat = patient.location_lat or 12.9716     # fallback (Bengaluru)
        user_lon = patient.location_lon or 77.5946

        print(f"[ROUTING] Using location: {user_lat}, {user_lon}")

        hospitals = RoutingService.get_nearby_hospitals(user_lat, user_lon)
        return hospitals

    def choose_hospital(self, patient, hospitals):
        """
        Choose best hospital based on ETA.
        """

        user_lat = patient.location_lat or 12.9716
        user_lon = patient.location_lon or 77.5946

        best = RoutingService.choose_best_hospital(user_lat, user_lon, hospitals)
        return best
