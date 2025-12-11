from pydantic import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Multi-Agent Healthcare Emergency Companion"
    DEBUG: bool = True

    # Placeholders – replace with real keys if you use Twilio, Maps, etc.
    MAPS_API_KEY: str | None = None
    NOTIFICATION_SENDER: str = "noreply@companion.ai"

settings = Settings()
