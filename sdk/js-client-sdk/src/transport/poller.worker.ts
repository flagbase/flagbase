import { Evaluations } from "../context";
import { fetchFlagsViaPoller } from "../fetch";
import {
  PollerWorkerRequestType,
  PollerWorkerResponseType,
} from "./types";

const ctx: Worker = self as any;

let timerId: NodeJS.Timeout = setTimeout(() => {}, 1);
let lastRefreshed: number = Date.now();
let tabVisible: boolean = true;

ctx.onmessage = async (e: MessageEvent) => {
  const {
    requestType,
    requestPayload: {
      pollingServiceUrl,
      clientKey,
      identity,
      etag: initialEtag,
      pollingIntervalMs,
    },
  } = e.data;

  let etag = initialEtag;

  const actualPollingIntervalMs: number =
    (pollingIntervalMs && pollingIntervalMs >= 3000 && pollingIntervalMs) ||
    3000;

  const schedule = async () => {
    timerId = setTimeout(
      async () => {
        await fetchAndReschedule();
      },
      actualPollingIntervalMs
    );
  };

  const fetchAndReschedule = async () => {
    const elapsedMs = Date.now() - lastRefreshed;
    if (elapsedMs >= actualPollingIntervalMs && tabVisible) {
      const onFullResponse = (reta: string, evaluations: Evaluations) =>
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
      lastRefreshed = Date.now();
    }
    await schedule();
  };

  switch (requestType) {
    case PollerWorkerRequestType.START:
      clearTimeout(timerId);
      await schedule();
      break;
    case PollerWorkerRequestType.STOP:
      clearTimeout(timerId);
      break;
    case PollerWorkerRequestType.TAB_HIDDEN:
      tabVisible = false;
      break;
    case PollerWorkerRequestType.TAB_VISIBLE:
      tabVisible = true;
      break;
  }
};

export default null as any;