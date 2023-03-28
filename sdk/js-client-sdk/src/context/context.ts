import { Config, DEFAULT_CONFIG } from "./config";
import { Identity, DEFAULT_IDENTITY } from "./identity";
import { Flagset, Flag } from "./flags";
import { DEFAULT_INTERNAL_DATA, InternalData } from "./internal-data";
import objectHash from '../util/object-hash';

export interface IContext {
  // config
  getConfig: () => Config;
  setConfig: (c: Partial<Config>) => void;
  // identity
  getIdentity: () => Identity;
  setIdentity: (i: Partial<Identity>) => void;
  getIdentityTraits: () => Identity["traits"];
  setIdentityTraits: (identityTraits: Identity["traits"]) => void;
  // flagset
  getAllFlags: () => Flagset;
  getFlag: (flagKey: string) => Flag;
  setFlag: (flagKey: string, flag: Flag) => void;
  // internal data
  getInternalData: () => InternalData;
  setInternalData: (i: Partial<InternalData>) => void;
}

type ContextDetails = {
  clientKey: string,
  clientConfig: Config,
  userIdentity: Identity
}

// Utility functions
const storageAvailable = () => {
  try {
    const storage = window.localStorage;
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
};

const saveToStorage = (prefix: string, key: string, value: object) => {
  if (storageAvailable()) {
    window.localStorage.setItem(`${prefix}_${key}`, JSON.stringify(value));
  }
};

const loadFromStorage = (prefix: string, key: string, defaultValue: object) => {
  if (storageAvailable()) {
    const value = window.localStorage.getItem(`${prefix}_${key}`);
    if (value !== null) {
      return JSON.parse(value);
    }
  }
  return defaultValue;
};

export default function Context(clientKey: string, clientConfig: Config, userIdentity: Identity) {
  let config: Config = {
    ...DEFAULT_CONFIG,
    ...clientConfig,
  };
  let identity: Identity = {
    ...DEFAULT_IDENTITY,
    ...userIdentity,
  };
  let flagset: Flagset = {};
  let internalData: InternalData = {
    ...DEFAULT_INTERNAL_DATA,
  };

  const contextDetails: ContextDetails = {
    clientKey,
    clientConfig,
    userIdentity
  };
  const contextHash: string = objectHash(contextDetails);

  // Load values from storage, if available
  const storedFlagset = loadFromStorage(contextHash, "flagset", {});
  const storedInternalData = loadFromStorage(contextHash, "internalData", DEFAULT_INTERNAL_DATA);

  config = { ...config };
  identity = { ...identity };
  flagset = { ...flagset, ...storedFlagset };
  internalData = { ...internalData, ...storedInternalData };

  // ... remaining methods ...

   /**
   * Config methods
   */
   const getConfig: IContext["getConfig"] = () => ({ ...config });

   const setConfig: IContext["setConfig"] = (clientConfig) => {
     config = {
       ...config,
       ...clientConfig,
     };
   };
 
   /**
    * Identity methods
    */
   const getIdentity: IContext["getIdentity"] = () => ({ ...identity });
 
   const setIdentity: IContext["setIdentity"] = (userIdentity) => {
     identity = {
       ...identity,
       ...userIdentity,
     };
   };
 
   const getIdentityTraits: IContext["getIdentityTraits"] = () => ({
     ...identity.traits,
   });
 
   const setIdentityTraits: IContext["setIdentityTraits"] = (identityTraits) => {
     identity = {
       ...identity,
       traits: {
         ...identity.traits,
         ...identityTraits,
       },
     };
   };
 
   /**
    * Flagset methods
    */
   const getAllFlags: IContext["getAllFlags"] = () => ({ ...flagset });
 
   const getFlag: IContext["getFlag"] = (flagKey) => ({ ...flagset[flagKey] });
 
   const setFlag: IContext["setFlag"] = (flagKey, flag) => {
     flagset[flagKey] = flag;
     saveToStorage(contextHash, "flagset", flagset);
   };
 
   /**
    * Internal data methods
    */
   const getInternalData: IContext["getInternalData"] = () => ({
     ...internalData,
   });
 
   const setInternalData: IContext["setInternalData"] = (userInternalData) => {
     internalData = { ...internalData, ...userInternalData };
     saveToStorage(contextHash, "internalData", internalData);
   };
 
   return {
     // config
     getConfig,
     setConfig,
     // identity
     getIdentity,
     setIdentity,
     getIdentityTraits,
     setIdentityTraits,
     // flagset
     getAllFlags,
     getFlag,
     setFlag,
     // internal data
     getInternalData,
     setInternalData,
   };
}

