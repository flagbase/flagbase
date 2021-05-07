import { Config, DEFAULT_CONFIG } from "./config";
import { Identity, DEFAULT_IDENTITY } from "./identity";
import { Flagset, Flag } from "./flags";

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
}

export default function Context(
  userConfig: Config,
  userIdentity: Identity
): IContext {
  let config: Config = {
    ...DEFAULT_CONFIG,
    ...userConfig,
  };
  let identity: Identity = {
    ...DEFAULT_IDENTITY,
    ...userIdentity,
  };
  let flagset: Flagset = {};

  /**
   * Config methods
   */
  const getConfig: IContext["getConfig"] = () => ({ ...config });

  const setConfig: IContext["setConfig"] = (userConfig) => {
    config = {
      ...config,
      ...userConfig,
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
  };
}
