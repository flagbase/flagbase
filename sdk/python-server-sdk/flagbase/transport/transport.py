from flagbase.config import Mode
from flagbase.context import Context
from flagbase.events import Events
from .poller import Poller

class Transport:
    def __init__(self, context: Context, events: Events):
        self.context = context
        self.events = events

        config = context.get_config()
        if config.mode == Mode.STREAMING:
            raise ValueError(f"{Mode.STREAMING} has not been implemented yet.")
        else:
            self.transport = Poller(context, events)

    def start(self):
        self.transport.start()

    def stop(self):
        self.transport.stop()