import { Mode, IContext } from "../context";
import Streamer from "./streamer";
import Poller from "./poller";
import { EventProducer } from "../events";

export interface ITransport {
  start: () => void;
  stop: () => void;
}

export default function Transport(clientKey: string, context: IContext, events: EventProducer): ITransport {
  return context.getConfig().mode === Mode.STREAMING
    ? Streamer(clientKey, context, events)
    : Poller(clientKey, context, events);
}
