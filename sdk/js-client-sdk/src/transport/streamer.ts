import { IContext } from "../context";
import { ITransport } from "./transport";

export default function Streamer(context: IContext): ITransport {
  const start = () => console.warn("Streamer not implemented yet.");

  const stop = () => console.warn("Streamer not implemented yet.");

  return {
    start,
    stop,
  };
}
