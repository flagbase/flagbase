from enum import Enum
from typing import List

from flagbase.types import EventType

class Mode(Enum):
    HYBRID = "hybrid"
    POLLING = "polling"
    STREAMING = "streaming"

class Config:
    def __init__(
        self, 
        server_key: str, 
        mode: Mode = Mode.POLLING, 
        polling_service_url: str = "https://poller.core.flagbase.com", 
        polling_interval_ms: int = 10000,
        log_events: List[EventType] = [EventType.LOG_CRITICAL, EventType.LOG_ERROR]):

        if server_key is None:
            raise ValueError("Missing Server SDK Key when constructing the client.")

        self.server_key = server_key
        self.mode = mode
        self.polling_service_url = polling_service_url
        self.polling_interval_ms = polling_interval_ms
        self.log_events = log_events

    def get_server_key(self) -> str:
        return self.server_key

    def get_mode(self) -> Mode:
        return self.mode

    def get_polling_service_url(self) -> str:
        return self.polling_service_url

    def get_polling_interval_ms(self) -> int:
        return self.polling_interval_ms

    def get_log_events(self) -> List[EventType]:
        return self.log_events