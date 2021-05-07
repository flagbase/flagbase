import Context from "../context";
import { ITransport } from "./transport";

class Streamer implements ITransport {
  private context: Context;

  constructor(context: Context) {
    this.context = context;
  }

  public start = () => console.warn('Streamer not implemented yet.')

  public stop = () => console.warn('Streamer not implemented yet.')
}

export default Streamer;
