export type InternalData = {
  numConsecutiveCachedRequests: number;
  numConsecutiveFailedRequests: number;
}

export const DEFAULT_INTERNAL_DATA: InternalData = {
  numConsecutiveCachedRequests: 0,
  numConsecutiveFailedRequests: 0,
}
