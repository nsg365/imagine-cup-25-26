# backend/services/notification.py

from typing import List, Dict
from ..twilio_config import client, TWILIO_NUMBER
import os

EMERGENCY_PHONE = os.getenv("EMERGENCY_PHONE")
print("EMERGENCY_PHONE =", EMERGENCY_PHONE)


def send_notification(commands: List[Dict]):
    """
    Sends notifications.
    For now, ALL SMS go to EMERGENCY_PHONE from .env
    """

    if not EMERGENCY_PHONE:
        raise RuntimeError("EMERGENCY_PHONE not set in .env")

    for cmd in commands:
        msg_type = cmd.get("type")
        message = cmd.get("message")

        print(f"[NOTIFICATION] Channel={msg_type} | Message={message}")

        if msg_type == "sms":
            try:
                to = EMERGENCY_PHONE.strip()

                client.messages.create(
                    body=message,
                    from_=TWILIO_NUMBER,
                    to=to
                )

                print(f"[SMS SENT] Successfully sent to {to}")

            except Exception as e:
                print(f"[SMS ERROR] Could not send SMS: {e}")
