from flagbase.config import Config
from flagbase.store import Store

class Context:
    def __init__(
        self,
        config: Config,
        raw_flags: Store = Store()):
        self.config = config
        self.raw_flags = raw_flags

    def get_config(self):
        return self.config


    def get_raw_flags(self):
        return self.raw_flags
