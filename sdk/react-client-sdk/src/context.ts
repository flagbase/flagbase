import React from 'react';
import { createContext } from "react";
import { IClient } from "@flagbase/js-client-sdk";

const initialState = {
  flagbaseClient: undefined as any,
  isReady: false,
  isDestroyed: false,
};

export type FlagbaseContextProps = {
  flagbaseClient: IClient,
  isReady: boolean,
  isDestroyed: boolean,
}

const FlagbaseContext: React.Context<FlagbaseContextProps> = createContext(initialState);

export default FlagbaseContext;