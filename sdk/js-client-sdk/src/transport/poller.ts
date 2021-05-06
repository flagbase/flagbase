import { fetchFlagsViaPoller } from "../api";
import Context from "../context";
import { Config, IConfigPolling } from "../context/config";
import { ITransport } from "./transport";

class Poller implements ITransport {
  private context: Context;
  private config: IConfigPolling;
  private endpointUri: Config["endpointUri"];
  private clientKey: Config["clientKey"];
  private etag: string;

  constructor(
    context: Context
  ) {
    this.context = context;
    this.config = context.getConfig() as IConfigPolling;
    this.endpointUri = this.config.endpointUri;
    this.clientKey = this.config.clientKey;
    this.etag = 'initial'
  }

  start = async () => {
    await fetchFlagsViaPoller(
      this.endpointUri,
      this.clientKey,
      this.context.getIdentity(),
      this.etag,
    );
    setInterval(async () => {
      const [retag, evaluation] = await fetchFlagsViaPoller(
        this.endpointUri,
        this.clientKey,
        this.context.getIdentity(),
        this.etag
      );
      Object.keys(evaluation).forEach(
        (flagKey) => this.context.setFlag(flagKey, evaluation[flagKey])
      );
      this.etag = retag;
    }, this.config.pollIntervalMilliseconds);
  };
}

export default Poller;
