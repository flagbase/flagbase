import threading, http.client, logging, ssl, json
from urllib.parse import urlparse
from flagbase.context import Context
from flagbase.events import Events, EventType

ssl._create_default_https_context = ssl._create_unverified_context

class Poller:
    def __init__(self, context: Context, events: Events):
        self.context = context
        self.events = events
        self._stop_event = threading.Event()
        self._polling_thread = None
        self._initialised_event = threading.Event()
        self._initialised = False

    def _poll(self):
        try:
            polling_service_url = self.context.get_config().get_polling_service_url()
            polling_interval_ms = self.context.get_config().get_polling_interval_ms()
            if polling_interval_ms < 3000:
                polling_interval_ms = 3000

            etag = 'initial'
            while not self._stop_event.is_set():
                parsed_url = urlparse(polling_service_url)
                connection = http.client.HTTPSConnection(parsed_url.netloc)
                connection.request(
                    "GET", parsed_url.path, headers={
                        'x-sdk-key': self.context.get_config().get_server_key(),
                        'ETag': etag
                    }
                )
                response = connection.getresponse()

                if response.status == 200:
                    data = json.loads(response.read())["data"]

                    for raw_flag in data:
                        self.context.get_raw_flags().add_flag(raw_flag["attributes"])

                    self.events.emit(
                        event_name=EventType.NETWORK_FETCH_FULL,
                        event_message="Retrieved full flagset from service.",
                        event_context=self.context.get_raw_flags().get_flags())

                    # release lock only on initial
                    if etag == 'initial':
                        self._initialised_event.set()
                        self._initialised = True

                    etag = response.getheader("Etag")                    

                elif response.status == 304:
                    self.events.emit(
                        event_name=EventType.NETWORK_FETCH_CACHED,
                        event_message="Retrieved cached flagset from service.")

                elif response.status != 200 or response.status != 304:
                    event_message = f"Unexpected response from poller [{polling_service_url}], with status code {response.status}"
                    errors = str(json.loads(response.read().decode('utf-8')))
                    self.events.emit(
                        event_name=EventType.NETWORK_FETCH_ERROR,
                        event_message=event_message,
                        event_context=errors)
                    self.events.emit(
                        event_name=EventType.LOG_ERROR,
                        event_message=event_message,
                        event_context=errors)
                    raise Exception(event_message, errors)

                self._stop_event.wait(polling_interval_ms / 1000)
        except Exception as e:
            msg = "Something went wrong when trying to retrieve rules from server."
            if self._initialised == False:
                # manually log error if not initialised, 
                # because the logging event listener hasn't been affed
                logging.error(msg, exc_info=e)
            pass

    def start(self):
        if self._polling_thread is None or not self._polling_thread.is_alive():
            self._stop_event.clear()
            self._polling_thread = threading.Thread(target=self._poll, daemon=True)
            self._polling_thread.start()
            self._initialised_event.wait()

    def stop(self):
        if self._polling_thread and self._polling_thread.is_alive():
            self._stop_event.set()
            self._polling_thread.join()
