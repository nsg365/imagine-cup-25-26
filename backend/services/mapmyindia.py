import requests
import os

CLIENT_ID = os.getenv("MAPMYINDIA_CLIENT_ID")
CLIENT_SECRET = os.getenv("MAPMYINDIA_CLIENT_SECRET")

_token = None

def _get_token():
    global _token
    if _token:
        return _token

    url = "https://outpost.mapmyindia.com/api/security/oauth/token"
    payload = {
        "grant_type": "client_credentials",
        "client_id": "96dHZVzsAuuKZJ8d793caWF4mPdl_8p_Hn0JdeA_5iizACKrpWIc4C1czdlmkRIuNnGZeDlWAVbQGbZMOA_Pfd7V3XRmlxJM",
        "client_secret": "lrFxI-iSEg9PiFEoGneFKDj5MVUuWDvzl8HJ2YNXNz_4ZNy8NsXpGWYJ6ggRrVW_ImEFOv1CXsy3USm1v9UZJsFQ2IPA7o9hq1qP_LjHZ_k="
    }

    response = requests.post(url, data=payload)
    response_data = response.json()
    _token = response_data.get("access_token")
    return _token


def get_hospital_phone_by_name(name: str):
    token = _get_token()
    url = f"https://atlas.mapmyindia.com/api/places/search/json?query={name}"
    headers = {"Authorization": f"Bearer {token}"}

    resp = requests.get(url, headers=headers)
    data = resp.json()

    if "suggestedLocations" in data and data["suggestedLocations"]:
        first = data["suggestedLocations"][0]
        return first.get("contact")

    return None


def get_nearby_hospital_phone(lat, lon):
    token = _get_token()

    if not token:
        print("[ERROR] Could not get MapMyIndia token")
        return None, None

    url = f"https://atlas.mapmyindia.com/api/places/nearby/json?keywords=hospital&refLocation={lat},{lon}"
    headers = {"Authorization": f"Bearer {token}"}

    resp = requests.get(url, headers=headers)
    data = resp.json()

    if "suggestedLocations" in data and data["suggestedLocations"]:
        first = data["suggestedLocations"][0]
        hospital_name = first.get("placeName")
        hospital_phone = first.get("contact")
        return hospital_name, hospital_phone

    return None, None

def get_hospital_phone_by_name(name: str):
    token = _get_token()

    if not token:
        print("[ERROR] Could not get MapMyIndia token")
        return None

    url = f"https://atlas.mapmyindia.com/api/places/search/json?query={name}"
    headers = {"Authorization": f"Bearer {token}"}

    resp = requests.get(url, headers=headers)
    data = resp.json()

    if "suggestedLocations" in data and data["suggestedLocations"]:
        first = data["suggestedLocations"][0]
        return first.get("contact")

    return None
