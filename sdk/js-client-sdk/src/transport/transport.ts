import Context, { Mode } from "../context";
import Streamer from './poller';
import Poller from './poller';

export interface ITransport {
  start: () => void
}

class Transport implements ITransport {
  private context: Context;
  private mode: Mode;
  private worker: ITransport;

  constructor(context: Context) {
    this.context = context;
    this.mode = this.context.getConfig().mode
    this.worker = new Poller(this.context);
  }

  start = () => {
    if (this.mode === Mode.STREAMING) {
      this.worker = new Streamer(this.context);
    }
    this.worker.start();
  }
}

export default Transport;
