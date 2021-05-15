export enum Mode {
  POLLING,
  STREAMING,
}
export type Config = IConfigPolling | IConfigStreaming;

export interface IConfig {
  clientKey: string;
  mode: Mode;
  pollingServiceUrl?: string;
}

export interface IConfigPolling extends IConfig {
  mode: Mode.POLLING;
  pollingIntervalMs?: number;
}

export interface IConfigStreaming extends IConfig {
  mode: Mode.STREAMING;
}

export const DEFAULT_CONFIG: Config = {
  mode: Mode.POLLING,
  clientKey: '',
  pollingServiceUrl: 'https://polling.flagbase.io',
  pollingIntervalMs: 1000
}
