export type InternalData = {
  consecutiveCachedRequests: number;
  consecutiveFailedRequests: number;
  flagsetChanges: number;
};

export const DEFAULT_INTERNAL_DATA: InternalData = {
  consecutiveCachedRequests: 0,
  consecutiveFailedRequests: 0,
  flagsetChanges: 0,
};
