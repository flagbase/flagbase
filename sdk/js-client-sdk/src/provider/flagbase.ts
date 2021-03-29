import { Config } from "../common/types";

type ClientConfig = Config & {
  endpoint?: string;
};

const DEFAULT_CONFIG = {
  endpoint: "http://api.flagbase.io",
};

export function init(userConfig: ClientConfig) {
  const config = (Object as any).assign({}, userConfig, DEFAULT_CONFIG);
  return {
    GetConfig: () => {
      return config;
    },
    GetFlag: () => {
      return "test";
    },
  };
}

export default init;
