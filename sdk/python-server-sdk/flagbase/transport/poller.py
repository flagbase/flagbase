import threading
import http.client
import ssl
import json
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

                    if etag == "initial":
                        self.events.emit(
                            event_name=EventType.CLIENT_READY,
                            event_message="Client is ready! Initial flagset has been retrieved.",
                            event_context=self.context.get_raw_flags().get_flags())

                    etag = response.getheader("Etag")                    
                    self._initialised_event.set()

                elif response.status == 304:
                    self.events.emit(
                        event_name=EventType.NETWORK_FETCH_CACHED,
                        event_message="Retrieved cached flagset from service.")

                elif response.status != 200 or response.status != 304:
                    msg = f"Unexpected response from poller [{polling_service_url}], with status code {response.status}: {response.read()}"
                    self.events.emit(
                        event_name=EventType.NETWORK_FETCH_ERROR,
                        event_message=msg)

                    raise Exception(msg)

                self._stop_event.wait(polling_interval_ms / 1000)
        except Exception as e:
            print(f"[Flagbase]: Something went wrong when trying to retrieve rules from server... Error: {e}")
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
