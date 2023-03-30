from enum import Enum


class EventType(Enum):
    NETWORK_FETCH_FULL = 'network_fetch_full'
    NETWORK_FETCH_CACHED = 'network_fetch_cached'
    NETWORK_FETCH_ERROR = 'network_fetch_error'
    EVALUATION = 'evaluation'
    # Log events: https://docs.python.org/3/library/logging.html#logging-levels
    LOG_CRITICAL = 'log_critical'
    LOG_ERROR = 'log_error'
    LOG_WARNING = 'log_warning'
    LOG_INFO = 'log_info'
    LOG_DEBUG = 'log_debug'