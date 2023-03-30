from enum import Enum
import logging
from typing import Any, Callable, Dict

from flagbase.context import Context
from flagbase.types import EventType

ListenerFn = Callable[[str, Any], None]
EventsMap = Dict[str, Dict[int, ListenerFn]]

class Events:
    def __init__(self, context: Context):
        self.events: EventsMap = {}
        self.context = context


    def emit(self, event_name: EventType, event_message: str, event_context: Any = None):
        event_key = event_name.value
        if event_key not in self.events:
            return
        for listener_fn in self.events[event_key].values():            
            match event_name:
                case (
                    EventType.LOG_CRITICAL,
                    EventType.LOG_ERROR,
                    EventType.LOG_WARNING,
                    EventType.LOG_INFO
                ):
                    if event_name in self.context.get_config().get_log_events():
                        self._log_event(
                            event_name=event_name,
                            event_message=event_message,
                            event_context=event_context)
                case _:
                    listener_fn(event_message, event_context)

    def on(self, event_name: EventType, listener_fn: ListenerFn):
        event_key = event_name.value
        if event_key not in self.events:
            self.events[event_key] = {}
        if callable(listener_fn):
            self.events[event_key][id(listener_fn)] = listener_fn

    def off(self, event_name: EventType, listener_fn: ListenerFn = None):
        event_key = event_name.value
        if listener_fn is not None:
            if event_key not in self.events or id(listener_fn) not in self.events[event_key]:
                return
            if event_key in self.events and id(listener_fn) in self.events[event_key]:
                del self.events[event_key][id(listener_fn)]
        else:
            if event_key in self.events:
                del self.events[event_key]

    def clear(self):
        self.events = {}

    def _log_event(self, event_name: EventType, event_message: str, event_context: Any = None):
        match event_name:
            case EventType.LOG_CRITICAL:
                logging.CRITICAL(event_message % (event_context,))
            case EventType.LOG_ERROR:
                logging.ERROR(event_message % (event_context,))
            case EventType.LOG_WARNING:
                logging.WARNING(event_message % (event_context,))
            case EventType.LOG_INFO:
                logging.INFO(event_message % (event_context,))
            case EventType.LOG_DEBUG:
                logging.DEBUG(event_message % (event_context,))
