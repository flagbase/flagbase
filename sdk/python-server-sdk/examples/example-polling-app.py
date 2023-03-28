from flagbase import FlagbaseClient, Config, Identity
import time


if __name__ == '__main__':
    flagbase = FlagbaseClient(
        config=Config(
            server_key="sdk-server_d4bbe70b-1c79-4f30-bfd7-ee9d4bafab85"
        )
    )

    while True:
        user = Identity("some-identifier", { "some-trait-key": "blue" })
        feature_variation = flagbase.variation("new-app-navigation", user, "control")
        print(f"Serving {feature_variation} for user...")
        time.sleep(3)