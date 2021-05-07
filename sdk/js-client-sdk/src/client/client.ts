import Api, { IApi } from "../api";
import Context, { Config, Identity, Mode } from "../context";
import Transport from "../transport";

export type ClientOptions = Config;

export interface IClient extends IApi {
  destroy: () => void;
}

export default function Client(
  clientKey: string,
  identity: Identity,
  opts?: ClientOptions
): IClient {
  const config: Config = {
    mode: Mode.POLLING,
    ...opts,
    clientKey,
  };
  const context = Context(config, identity);
  const transport = Transport(context);
  const api = Api(context);

  transport.start();

  const destroy = () => transport.stop();

  return {
    ...api,
    destroy,
  };
}
