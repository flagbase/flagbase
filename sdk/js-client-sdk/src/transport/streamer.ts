import { IContext } from "../context";
import { EventProducer } from "../events";
import { EventType } from "../events/event-type";
import { ITransport } from "./transport";

export default function Streamer(context: IContext, events: EventProducer): ITransport {
  const NOT_IMPL_MSG = "Streamer not implemented yet."

  const start = () => events.emit(EventType.DEBUG, NOT_IMPL_MSG)

  const stop = () => events.emit(EventType.DEBUG, NOT_IMPL_MSG)

  return {
    start,
    stop,
  };
}
