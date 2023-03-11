import { Evaluations, Identity } from "../context"


export enum PollerWorkerRequestType {
    START,
    STOP,
    RESET 
}

export type PollerWorkerRequest =  {
    requestType: PollerWorkerRequestType, 
    requestKey: string,
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