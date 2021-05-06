export enum Mode {
  POLLING,
  STREAMING,
}
export type Config = IConfigPolling | IConfigStreaming;

export interface IConfig {
  clientKey: string;
  mode: Mode;
  endpointUri?: string;
}

export interface IConfigPolling extends IConfig {
  mode: Mode.POLLING;
  pollIntervalMilliseconds?: number;
}

export interface IConfigStreaming extends IConfig {
  mode: Mode.STREAMING;
}

export const DEFAULT_CONFIG: Config = {
  mode: Mode.POLLING,
  clientKey: '',
  endpointUri: 'https://polling.flagbase.io',
  pollIntervalMilliseconds: 1000
}
