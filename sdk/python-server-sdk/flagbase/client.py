from flagbase.identity import Identity
from flagbase.config import Config
from flagbase.context import Context
from flagbase.events import EventType, Events, ListenerFn
from flagbase.transport.transport import Transport
from flagbase.evaluation.evaluation import Evaluation

class FlagbaseClient:
    def __init__(self, config: Config):
        self.config = config
        self.context = Context(config=config)
        self.events = Events()
        self.transport = Transport(context=self.context, events=self.events)
        self.evaluation = Evaluation(context=self.context, events=self.events)
        self.init()

    def init(self):
        self.transport.start()

    def destroy(self):
        self.transport.stop()

    def on(self, event_name: EventType, listener_fn: ListenerFn):
        return self.events.on(event_name=event_name, listener_fn=listener_fn)
    
    def off(self, event_name: EventType, listener_fn: ListenerFn):
        return self.events.off(event_name=event_name, listener_fn=listener_fn)

    def clear(self):
        self.events.clear()

    def variation(self, flag_key: str, identity: Identity, default_variation_key: str) -> str:
        if not self.context.get_raw_flags().exists(flag_key):
            return default_variation_key
        return self.evaluation.evaluate_flag_for_an_identity(flag_key, identity)