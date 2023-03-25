from flagbase import FlagbaseClient, Config, Identity
import time


if __name__ == '__main__':
    flagbase = FlagbaseClient(
        config=Config(
            server_key="sdk-server_491e7607-dac2-41dc-abed-1ba904cdb032",
            polling_service_url="http://localhost:9051",
            polling_interval_ms=1000
        )
    )

    while True:
        user = Identity("some-identifier", { "some-trait-key": "blue" })
        feature_variation = flagbase.variation("example-flag", user, "control")
        print(f"Serving {feature_variation} for user...")
        time.sleep(3)