import { fetchFlagsViaPoller } from "../fetch";
import { IContext, IConfigPolling } from "../context";
import { ITransport } from "./transport";

export default function Poller(context: IContext): ITransport {
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
  };

  const onCachedRequest = () => {
    const {
      numConsecutiveCachedRequests: prevNumConsecutiveCachedRequests,
    } = context.getInternalData();
    context.setInternalData({
      numConsecutiveCachedRequests: prevNumConsecutiveCachedRequests + 1,
      numConsecutiveFailedRequests: 0,
    });
  };

  const onErrorRequest = () => {
    const {
      numConsecutiveFailedRequests: prevNumConsecutiveFailedRequests,
    } = context.getInternalData();
    context.setInternalData({
      numConsecutiveCachedRequests: 0,
      numConsecutiveFailedRequests: prevNumConsecutiveFailedRequests + 1,
    });
  };

  const start = async () => {
    await fetchFlagsViaPoller(
      endpointUri,
      clientKey,
      context.getIdentity(),
      etag
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
      evaluation && Object.keys(evaluation).forEach((flagKey) =>
        context.setFlag(flagKey, evaluation[flagKey])
      );
      etag = retag;
    }, config.pollIntervalMilliseconds);
  };

  const stop = async () => clearInterval(interval);

  return {
    start,
    stop,
  };
}
