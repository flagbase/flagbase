import { Flagset, Identity } from "../context";
import { Config } from "../context/config";
import { ETAG_HEADER, SDK_KEY_HEADER } from "./constants";

type XHRPollingRequestHeaders = {
  [key: string]: string;
};
type XHRPollingResponse = {
  etag: string;
  status: number;
  data: Flagset | {};
  hasFailed: boolean;
};

const pollingRequest = (
  endpointUrl: string,
  requestBody: string,
  headers: XHRPollingRequestHeaders
): Promise<XHRPollingResponse> => {
  return new Promise((resolve, _) => {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", endpointUrl, true);
    Object.keys(headers).forEach((k) => xhr.setRequestHeader(k, headers[k]));
    xhr.onload = function () {
      if (this.readyState != 4) return;
      resolve({
        etag: this.getResponseHeader(ETAG_HEADER) || "unknown",
        status: this.status,
        hasFailed: !(this.status == 200 || this.status == 304),
        data: this.status == 200 ? JSON.parse(this.responseText).data : {},
      });
    };
    xhr.onerror = () => resolve({
      etag: "unknown",
      status: xhr.status,
      hasFailed: true,
      data: {},
    });
    xhr.send(requestBody);
  });
};

export const fetchFlagsViaPoller = async (
  pollingServiceUrl: Config["pollingServiceUrl"],
  clientKey: Config["clientKey"],
  identity: Identity,
  etag: string,
  onFullRequest?: () => void,
  onCachedRequest?: () => void,
  onErrorRequest?: () => void
): Promise<[string, Flagset]> => {
  const {
    etag: retag,
    status,
    data: flagset,
    hasFailed,
  } = await pollingRequest(
    String(pollingServiceUrl),
    JSON.stringify(identity),
    {
      [ETAG_HEADER]: etag,
      [SDK_KEY_HEADER]: clientKey,
    }
  );

  if (!hasFailed && status === 200) {
    typeof onFullRequest === "function" && onFullRequest();
  } else if (!hasFailed && status === 304) {
    typeof onCachedRequest === "function" && onCachedRequest();
  } else if (hasFailed) {
    typeof onErrorRequest === "function" && onErrorRequest();
  }

  return [retag, flagset];
};
