import { Config, DEFAULT_CONFIG } from "./config";
import { Identity, DEFAULT_IDENTITY } from "./identity";
import { Flagset, Flag } from "./flags";

class Context {
  private config: Config;
  private flagset: Flagset;
  private identity: Identity;

  constructor(config: Config, identity: Identity) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config
    };
    this.identity = {
      ...DEFAULT_IDENTITY,
      ...identity
    };
    this.flagset = {};
  }

  /**
   * Config methods
   */
  public getConfig = (): Config => this.config;

  public setConfig = (config: Partial<Config>): void => {
    this.config = {
      ...this.config,
      ...config,
    };
  };


  /**
   * Config methods
   */
  public getIdentity = (): Identity => this.identity;

  public setIdentity = (identity: Partial<Identity>): void => {
    this.identity = {
    ...this.identity,
    ...identity,
    };
  };

  public getIdentityTraits = (): Identity['traits'] => this.identity.traits;

  public setIdentityTraits = (identityTraits: Identity['traits']): void => {
    this.identity = {
    ...this.identity,
      traits: {
        ...this.identity.traits,
        ...identityTraits,
      }
    };
  };

  /**
   * Flagset methods
   */
  public getAllFlags = (): Flagset => this.flagset;

  public getFlag = (flagKey: string): Flag => this.flagset[flagKey];

  public setFlag = (flagKey: string, flag: Flag): void => {
    this.flagset[flagKey] = flag;
  };
}

export default Context;
