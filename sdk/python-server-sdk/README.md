# Flagbase Python Server SDK

Flagbase is a feature flag management system that helps you manage your application features easily and safely. The Python Server SDK enables developers to integrate Flagbase with their Python applications and control feature flag variations for different users.

## Installation
To install the Flagbase Python Server SDK, you can use pip:
```sh
pip install flagbase
```

## Usage
### Importing the SDK
First, import the necessary components from the flagbase package:
```python
from flagbase import FlagbaseClient, Config, Identity
```

### Creating a Flagbase Client
Create a FlagbaseClient instance with the appropriate configuration:
```python
flagbase = FlagbaseClient(
    config=Config(
        # Make sure you use the server SDK key (not the client SDK key)
        # Also be sure not to expose this secret, as anybody would be 
        # able to use it to get your flag rules from Flagbase
        server_key="sdk-server_491e7607-dac2-41dc-abed-1ba904cdb032"
    )
)
```

### User Identity
Create a user identity object with an identifier and traits:
```python
# Replace 'user_or_request_id' with a unique identifier
# This is essentially what you will use to split your traffic on
user_or_request_id = ...
user = Identity(user_or_request_id, {"some-trait-key": "blue"})
```

### Evaluating Feature Variations
Evaluate the feature variation for a specific user:
```python
feature_variation = flagbase.variation("some-flag-key", user, "control")
```

## Example Application
Here's an example of a simple application that uses the Flagbase Python Server SDK:
```python
from flagbase import FlagbaseClient, Config, Identity

if __name__ == '__main__':
    flagbase = FlagbaseClient(
        config=Config(
            server_key="sdk-server_491e7607-dac2-41dc-abed-1ba904cdb032",
        )
    )

    user_or_request_id = ...
    # user details might be pulled from your database
    user = Identity(
        user_or_request_id,
        {"some-trait-key": "blue"}
    )
    show_feature = flagbase.variation("example-flag", user, "control")
    
    if show_feature == "treatment":
        show_my_new_feature()
    elif show_feature == "control":
        show_existing_feature()
```

In this example, the application creates a Flagbase client, user identity, and evaluates the feature variation for that particular user. If the user/requestor belongs to the "treatment" cohort, then we show them the new feature. Otherwise we show them the existing feature.

# Advanced
## Event Listeners
The Flagbase Python Server SDK provides event listeners to help you monitor and react to events happening within the SDK. This can be useful for debugging, monitoring, and managing your application's performance.
### Usage
#### Adding Event Listeners
You can add event listeners to the Flagbase client by using the on method:
```python
def my_listener(message: str, context: Any):
    print(f"Received event: {message}")

flagbase.on(EventType.EVALUATION, my_listener)
```
In this example, my_listener is a function that prints the event message when the event is triggered. You can replace it with your own custom function to handle the events.

#### Removing Event Listeners
You can remove an event listener by using the `off` method:
```python
flagbase.off(EventType.EVALUATION, my_listener)
```
This will remove the `my_listener` function from listening to the `CLIENT_READY` event.

### Event Types
The available event types are:
* `NETWORK_FETCH`: A network fetch has been initiated.
* `NETWORK_FETCH_FULL`: A full network fetch has been completed.
* `NETWORK_FETCH_CACHED`: A cached network fetch has been completed.
* `NETWORK_FETCH_ERROR`: An error occurred during a network fetch.
* `EVALUATION`: An evaluation event has been triggered.

##### Log Event - Event Types:
Use these event types to listen in to different types of log events. 
Based on standard python logging levels: https://docs.python.org/3/library/logging.html#logging-levels
* `LOG_CRITICAL`: This event type represents a critical error that occurred in the code, which could lead to a crash or other serious issue that requires immediate attention.
* `LOG_ERROR`: This event type represents a non-critical error that occurred in the code, which may not require immediate attention but should be logged and monitored.
* `LOG_WARNING`: This event type represents a warning message that occurred in the code, which indicates a potential issue or error that should be investigated.
* `LOG_INFO`: This event type represents an informational message that occurred in the code, which may be useful for monitoring or debugging purposes.
* `LOG_DEBUG`: This event type represents a debug message that occurred in the code, which provides additional information for debugging and troubleshooting purposes.