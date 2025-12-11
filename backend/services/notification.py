from typing import List, Dict

def send_notification(commands: List[Dict]):
    # For prototype: print to console / logs
    for cmd in commands:
        print(f"[NOTIFICATION] To={cmd.get('to')} | Channel={cmd.get('type')} | Message={cmd.get('message')}")
