import { fetchFlagsViaPoller } from "../fetcher";
import Context from "../context";
import { Config, IConfigPolling } from "../context/config";
import { ITransport } from "./transport";

class Poller implements ITransport {
  private context: Context;
  private config: IConfigPolling;
  private endpointUri: Config["endpointUri"];
  private clientKey: Config["clientKey"];
  private etag: string;
  private interval: NodeJS.Timer;

  constructor(
    context: Context
  ) {
    this.context = context;
    this.config = context.getConfig() as IConfigPolling;
    this.endpointUri = this.config.endpointUri;
    this.clientKey = this.config.clientKey;
    this.etag = 'initial'
    this.interval = setInterval(() => {});
  }

  public start = async () => {
    await fetchFlagsViaPoller(
      this.endpointUri,
      this.clientKey,
      this.context.getIdentity(),
      this.etag,
    );
    this.interval = setInterval(async () => {
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

  public stop = async () => clearInterval(this.interval)
}

export default Poller;
