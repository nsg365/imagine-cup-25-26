from enum import Enum

class IncidentStatus(str, Enum):
    NO_INCIDENT = "NO_INCIDENT"
    SUSPECTED = "SUSPECTED"
    CONFIRMED_EMERGENCY = "CONFIRMED_EMERGENCY"
    NOTIFICATIONS_SENT = "NOTIFICATIONS_SENT"
    EMERGENCY = "emergency"
    CRITICAL = "critical"
    RESOLVED = "RESOLVED"
