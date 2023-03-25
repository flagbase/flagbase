from enum import Enum
from typing import Any, Callable, Dict

class EventType(Enum):
    CLIENT_READY = 'client_ready'
    NETWORK_FETCH = 'network_fetch'
    NETWORK_FETCH_FULL = 'network_fetch_full'
    NETWORK_FETCH_CACHED = 'network_fetch_cached'
    NETWORK_FETCH_ERROR = 'network_fetch_error'
    DEBUG = 'debug'
    EVALUATION = 'evaluation'

ListenerFn = Callable[[str, Any], None]
EventsMap = Dict[str, Dict[str, ListenerFn]]

class Events:
    def __init__(self):
        self.events: EventsMap = {}

    def emit(self, event_name: EventType, event_message: str, event_context: Any = None):
        if event_name not in self.events:
            return
        for listener_fn in self.events[event_name].values():
            listener_fn(event_message, event_context)

    def on(self, event_name: EventType, listener_fn: ListenerFn):
        if event_name not in self.events:
            self.events[event_name] = {}
        if callable(listener_fn):
            self.events[event_name][str(listener_fn)] = listener_fn

    def off(self, event_name: EventType, listener_fn: ListenerFn = None):
        if listener_fn is not None:
            if event_name not in self.events or str(listener_fn) not in self.events[event_name]:
                return
            if event_name in self.events and str(listener_fn) in self.events[event_name]:
                del self.events[event_name][str(listener_fn)]
        else:
            if event_name in self.events:
                del self.events[event_name]

    def clear(self):
        self.events = {}