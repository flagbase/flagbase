import { fetchFlagsViaPoller } from "../fetch";
import { IContext, IConfigPolling } from "../context";
import { ITransport } from "./transport";

export default function Poller(context: IContext): ITransport {
  const config = context.getConfig() as IConfigPolling;
  const endpointUri = config.endpointUri;
  const clientKey = config.clientKey;

  let interval = setInterval(() => {});
  let etag = "initial";

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
        etag
      );
      Object.keys(evaluation).forEach((flagKey) =>
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
