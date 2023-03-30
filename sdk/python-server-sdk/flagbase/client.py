from flagbase.identity import Identity
from flagbase.config import Config
from flagbase.context import Context
from flagbase.events import Events, ListenerFn
from flagbase.transport.transport import Transport
from flagbase.evaluation.evaluation import Evaluation
from flagbase.types import EventType

class FlagbaseClient:
    def __init__(self, config: Config):
        self.config = config
        self.context = Context(config=config)
        self.events = Events(context=self.context)
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
        try:
            if not self.context.get_raw_flags().exists(flag_key):
                self.events.emit(
                    event_name=EventType.LOG_WARNING,
                    event_message=(
                        f"Missing flag key in store flag={flag_key}... "
                        f"Serving the default variation={default_variation_key}."
                    ),
                    event_context=self.context.get_raw_flags().get_flags()
                )
                evaluation = {
                    'FlagKey': flag_key,
                    'Reason': 'missing_flag_key_in_store',
                    'VariationKey': default_variation_key
                }
                self.events.emit(EventType.EVALUATION, flag_key, evaluation)
                return default_variation_key
            return self.evaluation.evaluate_flag_for_an_identity(flag_key, identity)
        except Exception as e:
            self.events.emit(
                event_name=EventType.LOG_ERROR,
                event_message=(
                    f"Something went wrong when trying to evaluate flag={flag_key}..."
                    f" Serving the default variation={default_variation_key}."
                ),
                event_context=e
            )
            evaluation = {
                'FlagKey': flag_key,
                'Reason': 'evaluation_error',
                'VariationKey': default_variation_key
            }
            self.events.emit(EventType.EVALUATION, flag_key, evaluation)
            return default_variation_key