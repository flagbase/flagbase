import { Mode, IContext } from "../context";
import Streamer from "./streamer";
import Poller from "./poller";

export interface ITransport {
  start: () => void;
  stop: () => void;
}

export default function Transport(context: IContext): ITransport {
  return context.getConfig().mode === Mode.STREAMING
    ? Streamer(context)
    : Poller(context);
}
