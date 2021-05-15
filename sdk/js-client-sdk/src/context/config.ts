export enum Mode {
  HYBRID,
  POLLING,
  STREAMING,
}
export type Config = {
  clientKey: string;
  mode: Mode;
  pollingServiceUrl?: string;
  pollingIntervalMs?: number;
};

export const DEFAULT_CONFIG: Config = {
  mode: Mode.POLLING,
  clientKey: '',
  pollingServiceUrl: 'https://polling.flagbase.io',
  pollingIntervalMs: 300000
}
