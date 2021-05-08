import { fetchFlagsViaPoller } from "../fetch";
import { IContext, IConfigPolling } from "../context";
import { ITransport } from "./transport";
import { EventProducer } from "../events";
import { EventType } from "../events/event-type";

export default function Poller(
  context: IContext,
  events: EventProducer
): ITransport {
  const config = context.getConfig() as IConfigPolling;
  const endpointUri = config.endpointUri;
  const clientKey = config.clientKey;

  let interval = setInterval(() => {});
  let etag = "initial";

  const onFullRequest = () => {
    context.setInternalData({
      numConsecutiveCachedRequests: 0,
      numConsecutiveFailedRequests: 0,
    });
    events.emit(
      EventType.NETWORK_FETCH_FULL,
      "Retrieved full flagset from service.",
      context.getInternalData()
    );
  };

  const onCachedRequest = () => {
    const {
      numConsecutiveCachedRequests: prevNumConsecutiveCachedRequests,
    } = context.getInternalData();
    context.setInternalData({
      numConsecutiveCachedRequests: prevNumConsecutiveCachedRequests + 1,
      numConsecutiveFailedRequests: 0,
    });
    events.emit(
      EventType.NETWORK_FETCH_CACHED,
      "Retrieved cached flagset from service.",
      context.getInternalData()
    );
  };

  const onErrorRequest = () => {
    const {
      numConsecutiveFailedRequests: prevNumConsecutiveFailedRequests,
    } = context.getInternalData();
    context.setInternalData({
      numConsecutiveCachedRequests: 0,
      numConsecutiveFailedRequests: prevNumConsecutiveFailedRequests + 1,
    });
    events.emit(
      EventType.NETWORK_FETCH_ERROR,
      "Unable to retrieved flagset from service.",
      context.getInternalData()
    );
  };

  const start = async () => {
    await fetchFlagsViaPoller(
      endpointUri,
      clientKey,
      context.getIdentity(),
      etag
    );
    events.emit(
      EventType.NETWORK_FETCH,
      "Initial flags from service.",
      context.getInternalData()
    );

    interval = setInterval(async () => {
      const [retag, evaluation] = await fetchFlagsViaPoller(
        endpointUri,
        clientKey,
        context.getIdentity(),
        etag,
        onFullRequest,
        onCachedRequest,
        onErrorRequest
      );
      if (JSON.stringify(context.getAllFlags()) !== JSON.stringify(evaluation) && evaluation !== undefined) {
        Object.keys(evaluation).forEach((flagKey) =>
          context.setFlag(flagKey, evaluation[flagKey])
        );
        events.emit(EventType.FLAG_CHANGE, "Flagset has changed")
      }

      if (etag === "initial" && retag !== etag) {
        events.emit(
          EventType.CLIENT_READY,
          "Client is ready! Initial flagset has been retrieved.",
          context.getAllFlags()
        );
      }

      etag = retag;

      events.emit(
        EventType.NETWORK_FETCH,
        "Fetched flags from service.",
        context.getInternalData()
      );
    }, config.pollIntervalMilliseconds);
  };

  const stop = async () => clearInterval(interval);

  return {
    start,
    stop,
  };
}
