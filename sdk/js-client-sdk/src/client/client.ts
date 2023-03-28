import Api, { IApi } from "../api";
import Context, { Config, Identity, Mode } from "../context";
import Events, { EventConsumer, EventType } from "../events";
import Transport from "../transport";

export type ClientOptions = Config;

export interface IClient extends IApi, EventConsumer {
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
  };
  const events = Events();
  const context = Context(clientKey, config, identity);
  const transport = Transport(clientKey, context, events);
  const api = Api(context, events);

  transport.start();

  const { on, off, clear } = events;

  const destroy = () => {
    clear();
    transport.stop();
  };

  return {
    ...api,
    on,
    off,
    clear,
    destroy,
  };
}
