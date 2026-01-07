import os
from dotenv import load_dotenv
from twilio.rest import Client

load_dotenv()  # ← IMPORTANT

TWILIO_SID = os.getenv("TWILIO_SID")
TWILIO_TOKEN = os.getenv("TWILIO_TOKEN")
TWILIO_NUMBER = os.getenv("TWILIO_NUMBER")

client = None

if TWILIO_SID and TWILIO_TOKEN:
    client = Client(TWILIO_SID, TWILIO_TOKEN)
else:
    print("[WARNING] Twilio credentials not set. SMS disabled.")

