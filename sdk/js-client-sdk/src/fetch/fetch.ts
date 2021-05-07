import axios from "axios";
import { Flagset, Identity } from "../context";
import { Config } from "../context/config";
import { ETAG_HEADER, SDK_KEY_HEADER } from "./constants";

export const fetchFlagsViaPoller = async (
  endpointUri: Config["endpointUri"],
  clientKey: Config["clientKey"],
  identity: Identity,
  etag: string
): Promise<[string, Flagset]> => {
  let retag = etag;
  let flagset: Flagset = {};

  flagset = await axios
    .post(String(endpointUri), identity, {
      headers: {
        [ETAG_HEADER]: etag,
        [SDK_KEY_HEADER]: clientKey,
      },
    })
    .then((data) => {
      retag = data?.headers?.etag || etag;
      return data;
    })
    .then(({ data }: any) => data.data as Flagset)
    .catch((err) => {
      return {}
    });

  return [retag, flagset];
};
