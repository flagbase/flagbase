import { fetchFlagsViaPoller } from "../fetch";
import { Evaluations, Flagset, IContext } from "../context";
import { ITransport } from "./transport";
import { EventProducer } from "../events";
import { EventType } from "../events/event-type";
import { PollerWorkerRequestType, PollerWorkerResponse, PollerWorkerResponseType } from './types';
import PollerWorker from 'worker-loader!./poller.worker';

const INITIAL_ETAG = "initial";

export default function Poller(
  context: IContext,
  events: EventProducer
): ITransport {
  const config = context.getConfig();
  const pollingServiceUrl = config.pollingServiceUrl;
  const clientKey = config.clientKey;
  let etag = INITIAL_ETAG;

  const onFullResponse = (retag: string, evaluations: Evaluations) => {
    if (evaluations?.length) {
      evaluations.forEach((evaluation) =>
        context.setFlag(evaluation.attributes.flagKey, evaluation.attributes)
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
      context.setInternalData({
        consecutiveCachedRequests: 0,
        consecutiveFailedRequests: 0,
      });
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


    events.emit(
      EventType.NETWORK_FETCH_FULL,
      "Retrieved full flagset from service.",
      context.getInternalData()
    );
  };

  const onCachedResponse = () => {
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

  const onErrorResponse = () => {
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

  let start: () => void = () => {};
  let stop: () => void = () => {};

  if (typeof(Worker) !== "undefined") {
    // WebWorkers is supported then start polling via web worker
    const pollerWorker = new PollerWorker();
    const requestKey = `${pollingServiceUrl}-${clientKey}`;

    start = async () => {
      events.emit(
        EventType.NETWORK_FETCH,
        "Starting to fetch initial flags from poller.",
        context.getInternalData()
      );
  
      pollerWorker.postMessage({
        requestType: PollerWorkerRequestType.START,
        requestKey,
        requestPayload: {
          pollingServiceUrl,
          clientKey,
          identity: context.getIdentity(),
          etag,
          pollingIntervalMs: config.pollingIntervalMs
        }
      });
  
      pollerWorker.onmessage = (e: MessageEvent) => {
        const {
          responseType,
          responsePayload
        } = e.data as PollerWorkerResponse;
        switch (responseType) {
          case PollerWorkerResponseType.FULL:
            const { retag, evaluations } = responsePayload;
            onFullResponse(retag, evaluations);
            break;
          case PollerWorkerResponseType.CACHED:
            onCachedResponse();
            break;
          case PollerWorkerResponseType.ERROR:
            onErrorResponse();
            break;
          default: 
            console.error(`Unknown response type emitted by poller-worker: ${responseType}`);
        }
      };
    };

    stop = async () => {
      pollerWorker.postMessage({
        requestType: PollerWorkerRequestType.RESET,
        requestKey,
        requestPayload: {
          pollingServiceUrl,
          clientKey,
          identity: context.getIdentity(),
          etag,
          pollingIntervalMs: config.pollingIntervalMs
        }
      });
      pollerWorker.terminate()
    }
  } else {
    // Otherwise fallback to using main thread
    let timerId: number;

    start = async () => {
      const [retag, evaluations] = await fetchFlagsViaPoller(
        pollingServiceUrl,
        clientKey,
        context.getIdentity(),
        etag,
        onFullResponse,
        onCachedResponse,
        onErrorResponse
      );
      etag = retag;

      timerId = setTimeout(start, config.pollingIntervalMs);
    };
    
    stop = async () => {
      clearTimeout(timerId);
    };
  }

  return {
    start,
    stop,
  };
}
