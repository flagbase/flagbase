import { Evaluations } from "../context";
import { fetchFlagsViaPoller } from "../fetch";
import {
  PollerWorkerRequest,
  PollerWorkerRequestType,
  PollerWorkerResponseType,
} from "./types";

const ctx: Worker = self as any;

const connections = new Map<string, NodeJS.Timeout | null>();

ctx.onmessage = async (e: MessageEvent<PollerWorkerRequest>) => {
  const {
    requestType,
    requestKey,
    requestPayload: {
      pollingServiceUrl,
      clientKey,
      identity,
      etag: initialEtag,
      pollingIntervalMs,
    },
  } = e.data;

  switch (requestType) {
    case PollerWorkerRequestType.START:
      if (connections.has(requestKey)) {
        console.info(
          `[Poller Worker] Already running for request: ${requestKey}.. skipping...`
        );
      } else {
        let etag = initialEtag;

        let timerId: NodeJS.Timeout | null = null;
        const start = async () => {
          const onFullResponse = (retag, evaluations) =>
            ctx.postMessage({
              responseType: PollerWorkerResponseType.FULL,
              responsePayload: { retag, evaluations },
            });

          const onCachedResponse = () =>
            ctx.postMessage({
              responseType: PollerWorkerResponseType.CACHED,
              responsePayload: {},
            });

          const onErrorResponse = () =>
            ctx.postMessage({
              responseType: PollerWorkerResponseType.ERROR,
              responsePayload: {},
            });

          const [retag, evaluations] = await fetchFlagsViaPoller(
            pollingServiceUrl,
            clientKey,
            identity,
            etag,
            onFullResponse,
            onCachedResponse,
            onErrorResponse
          );
          etag = retag;

          timerId = setTimeout(start, pollingIntervalMs);
        };

        await start();

        connections.set(requestKey, timerId);
      }
      break;
    case PollerWorkerRequestType.STOP:
      if (connections.has(requestKey)) {
        const timerId = connections.get(requestKey);
        if (timerId !== null) {
          clearTimeout(timerId);
        }
      } else {
        console.error(
          `[Poller Worker] Unabled to stop request: ${requestKey}.. skipping...`
        );
      }
      break;
    case PollerWorkerRequestType.RESET:
      connections.forEach((connection) => connection !== null && clearTimeout(connection));
      break;
  }
};
