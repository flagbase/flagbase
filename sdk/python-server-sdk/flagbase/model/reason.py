from enum import Enum

class Reason(Enum):
    FALLTHROUGH = "FALLTHROUGH"
    FALLTHROUGH_WEIGHTED = "FALLTHROUGH_WEIGHTED"
    TARGETED = "TARGETED"
    TARGETED_WEIGHTED = "TARGETED_WEIGHTED"
    DEFAULT_FALLTHROUGH = "DEFAULT_FALLTHROUGH"