import Api, { IApi } from "../api";
import Context, { Config, Identity, Mode } from "../context";
import Events, { EventConsumer } from "../events";
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
    clientKey,
  };
  const events = Events();
  const context = Context(config, identity);
  const transport = Transport(context, events);
  const api = Api(context);

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
