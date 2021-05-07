import Context, { Config, Flag, Flagset, Identity, Mode } from "../context";
import Transport from "../transport";

export type ClientOptions = Config;

export interface IClient {
  variation: (
    flagKey: string,
    defaultVariationKey: string
  ) => Flag["variationKey"];
}

class Client implements IClient {
  private context: Context;
  private transport: Transport;

  constructor(clientKey: string, identity: Identity, opts?: ClientOptions) {
    const config: Config = {
      mode: Mode.POLLING,
      ...opts,
      clientKey,
    };
    this.context = new Context(config, identity);
    this.transport = new Transport(this.context);
    this.transport.start();
  }

  public destroy = () => this.transport.stop();

  /**
   * Get flag variation
   * @param flagKey the flag key
   * @param defaultVariation default fallthrough variation key
   * @returns variation key (or default fallthrough variation if flag not recognized)
   */
  public variation: IClient["variation"] = (flagKey, defaultVariationKey) => {
    return this.context.getFlag(flagKey)?.variationKey || defaultVariationKey;
  };

  public getAllFlags = (): Flagset => this.context.getAllFlags();
}

export default Client;
