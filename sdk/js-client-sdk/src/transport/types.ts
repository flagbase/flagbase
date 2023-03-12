import { Evaluations, Identity } from "../context"


export enum PollerWorkerRequestType {
    START,
    STOP,
    TAB_VISIBLE,
    TAB_HIDDEN,
}

export type PollerWorkerRequest =  {
    requestType: PollerWorkerRequestType, 
    requestPayload: {
      pollingServiceUrl: string,
      clientKey: string,
      identity: Identity,
      etag: string,
      pollingIntervalMs: number,
    },
}

export enum PollerWorkerResponseType {
    FULL,
    CACHED,
    ERROR 
} 

export type PollerWorkerResponse = {
    responseType: PollerWorkerResponseType,
    responsePayload: {
        retag: string,
        evaluations: Evaluations
    }
}