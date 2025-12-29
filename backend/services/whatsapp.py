import os
from twilio.rest import Client

ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
FROM_NUMBER = os.getenv("TWILIO_WHATSAPP_FROM")

_client = None

def _get_client():
    global _client
    if _client is None:
        _client = Client(ACCOUNT_SID, AUTH_TOKEN)
    return _client


def send_whatsapp(to_number: str, message: str):
    if not to_number.startswith("whatsapp:"):
        to_number = f"whatsapp:{to_number}"

    client = _get_client()

    msg = client.messages.create(
        body=message,
        from_=FROM_NUMBER,
        to=to_number
    )

    print(f"[WHATSAPP] Sent to {to_number} | SID={msg.sid}")
