import { fetchFlagsViaPoller } from "../fetch";
import { IContext, IConfigPolling } from "../context";
import { ITransport } from "./transport";
import { EventProducer } from "../events";
import { EventType } from "../events/event-type";

const INITIAL_ETAG = "initial";

export default function Poller(
  context: IContext,
  events: EventProducer
): ITransport {
  const config = context.getConfig() as IConfigPolling;
  const endpointUri = config.endpointUri;
  const clientKey = config.clientKey;

  let interval = setInterval(() => {});
  let etag = INITIAL_ETAG;

  const onFullRequest = () => {
    context.setInternalData({
      consecutiveCachedRequests: 0,
      consecutiveFailedRequests: 0,
    });
    events.emit(
      EventType.NETWORK_FETCH_FULL,
      "Retrieved full flagset from service.",
      context.getInternalData()
    );
  };

  const onCachedRequest = () => {
    const {
      consecutiveCachedRequests: prevConsecutiveCachedRequests,
    } = context.getInternalData();
    context.setInternalData({
      consecutiveCachedRequests: prevConsecutiveCachedRequests + 1,
      consecutiveFailedRequests: 0,
    });
    events.emit(
      EventType.NETWORK_FETCH_CACHED,
      "Retrieved cached flagset from service.",
      context.getInternalData()
    );
  };

  const onErrorRequest = () => {
    const {
      consecutiveFailedRequests: prevConsecutiveFailedRequests,
    } = context.getInternalData();
    context.setInternalData({
      consecutiveCachedRequests: 0,
      consecutiveFailedRequests: prevConsecutiveFailedRequests + 1,
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
      if (
        evaluation &&
        JSON.stringify(context.getAllFlags()) !== JSON.stringify(evaluation) &&
        Object.keys(evaluation).length !== 0
      ) {
        Object.keys(evaluation).forEach((flagKey) =>
          context.setFlag(flagKey, evaluation[flagKey])
        );
        const {
          flagsetChanges: prevFlagsetChanges,
        } = context.getInternalData();
        context.setInternalData({
          flagsetChanges: prevFlagsetChanges + 1,
        });
        events.emit(EventType.FLAG_CHANGE, "Flagset has changed");
      }

      if (etag === INITIAL_ETAG && retag !== etag) {
        events.emit(
          EventType.CLIENT_READY,
          "Client is ready! Initial flagset has been retrieved.",
          context.getAllFlags()
        );
      }

      etag = retag;

      events.emit(
        EventType.NETWORK_FETCH,
        "Fetched flags from service via polling.",
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
