export type Flagset = {
  [flagKey: string]: Flag;
};

export type Flag = {
  flagKey: string;
  variationKey: string;
  reason: REASONS;
};

export enum REASONS {
  FALLTHROUGH = 'FALLTHROUGH',
  FALLTHROUGH_WEIGHTED = 'FALLTHROUGH_WEIGHTED',
  TARGETED = 'TARGETED',
  TARGETED_WEIGHTED = 'TARGETED_WEIGHTED',
  DEFAULT_FALLTHROUGH = 'DEFAULT_FALLTHROUGH',
}
