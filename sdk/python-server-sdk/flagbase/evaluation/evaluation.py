from flagbase.identity import Identity
from flagbase.config import Mode
from flagbase.context import Context
from flagbase.events import Events, EventType
from flagbase.evaluation.engine import evaluate
from flagbase.util.hashutil import hash_keys

class Evaluation:
    def __init__(self, context: Context, events: Events):
        self.context = context
        self.events = events

    def evaluate_flag_for_an_identity(self, flag_key: str, identity: Identity) -> str:
        raw_flag = self.context.get_raw_flags().get_flag(flag_key=flag_key)
        salt = hash_keys(flag_key, identity.identifier)
        evaluation = evaluate(raw_flag, salt, identity)
        self.events.emit(EventType.EVALUATION, flag_key, evaluation)
        return evaluation["VariationKey"]