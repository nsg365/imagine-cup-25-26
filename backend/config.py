from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Multi-Agent Healthcare Emergency Companion"
    DEBUG: bool = True

    MAPS_API_KEY: str | None = "AIzaSyAOs8nNIYlGFH3jP8JRtcq3JqbFDfO570g"

settings = Settings()
