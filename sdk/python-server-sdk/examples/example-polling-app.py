from flagbase import FlagbaseClient, Config, Identity, EventType
import time
import random, string


if __name__ == '__main__':
    flagbase = FlagbaseClient(
        config=Config(
            server_key="sdk-server_2af3808a-4bd9-4d5b-9796-9892741ebc07",
            polling_interval_ms=3000
        )
    )

    def evaluation_listener(message: str, context):
        print(f"Evaluated flag: {message} ~ {context}")
    flagbase.on(EventType.EVALUATION, evaluation_listener)

    # def error_listener(message: str, context):
    #     print(f"ERROR: {message} ~ {context}")
    # flagbase.on(EventType.LOG_ERROR, error_listener)

    # def warning_listener(message: str, context):
    #     print(f"WARNING: {message} ~ {context}")
    # flagbase.on(EventType.LOG_WARNING, warning_listener)

    # def info_listener(message: str, context):
    #     print(f"INFO: {message} ~ {context}")
    # flagbase.on(EventType.LOG_INFO, info_listener)

    # def debug_listener(message: str, context):
    #     print(f"DEBUG: {message} ~ {context}")
    # flagbase.on(EventType.LOG_DEBUG, debug_listener)

    # def network_cache_listener(message: str, context):
    #     print(f"Got Cached flag: {message} ~ {context}")
    # flagbase.on(EventType.NETWORK_FETCH_CACHED, network_cache_listener)

    while True:
        user_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=100))
        user = Identity(user_id, { "some-trait-key": "blue" })
        feature_variation = flagbase.variation("new-app-navigation", user, "control")
        time.sleep(3)