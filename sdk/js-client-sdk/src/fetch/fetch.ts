import axios from "axios";
import { Flagset, Identity } from "../context";
import { Config } from "../context/config";
import { ETAG_HEADER, SDK_KEY_HEADER } from "./constants";

export const fetchFlagsViaPoller = async (
  endpointUri: Config["endpointUri"],
  clientKey: Config["clientKey"],
  identity: Identity,
  etag: string,
  onFullRequest?: () => void,
  onCachedRequest?: () => void,
  onErrorRequest?: () => void
): Promise<[string, Flagset]> => {
  let retag = etag;
  let flagset: Flagset = {};

  flagset = await axios
    .post(String(endpointUri), identity, {
      headers: {
        [ETAG_HEADER]: etag,
        [SDK_KEY_HEADER]: clientKey,
      },
      validateStatus: (status) => status >= 200 && status <= 304,
    })
    .then((data) => {
      if (data.status === 304) {
        typeof onCachedRequest === "function" && onCachedRequest();
      } else if (data.status === 200) {
        typeof onFullRequest === "function" && onFullRequest();
      }
      retag = data?.headers?.etag || etag;
      return data;
    })
    .then(({ data }: any) => data.data as Flagset)
    .catch(() => {
      typeof onErrorRequest === "function" && onErrorRequest();
      return {};
    });

  return [retag, flagset];
};
