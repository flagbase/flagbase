export enum Mode {
  HYBRID,
  POLLING,
  STREAMING,
}
export type Config = {
  mode?: Mode;
  pollingServiceUrl?: string;
  pollingIntervalMs?: number;
};

export const DEFAULT_CONFIG: Config = {
  mode: Mode.POLLING,
  pollingServiceUrl: 'https://poller.core.flagbase.com',
  pollingIntervalMs: 300000
}
