import React, { useEffect, useState } from "react";
import FlagbaseClient, {
  IClient,
  ClientOptions,
  Flagset,
  IConfigPolling,
  Identity,
  InternalData,
} from "../src/index";

const BORDER_STYLE = { border: "1px solid black" };

export type PollingAppProps = {
  clientKey: string;
  identity: Identity;
  opts: ClientOptions;
};

const PollingApp: React.FC<PollingAppProps> = (props) => {
  const [flagset, setFlagset] = useState<Flagset>({});
  const [internalData, setInternalData] = useState<InternalData>({
    numConsecutiveCachedRequests: 0,
    numConsecutiveFailedRequests: 0,
  });

  let interval;

  let flagbaseClient: IClient;

  useEffect(() => {
    flagbaseClient = FlagbaseClient(
      props.clientKey,
      props.identity,
      props.opts
    );

    return function cleanup() {
      flagbaseClient.destroy();
    };
  }, []);

  useEffect(() => {
    interval = setInterval(() => {
      setFlagset(flagbaseClient.getAllFlags());
      setInternalData(flagbaseClient.getInternalData());
    }, (props.opts as IConfigPolling)?.pollIntervalMilliseconds || 1000);

    return function cleanup() {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <h3>Evaluated Flagset</h3>
      <table style={BORDER_STYLE}>
        <thead>
          <tr>
            <th style={BORDER_STYLE}>Flag</th>
            <th style={BORDER_STYLE}>Variation</th>
            <th style={BORDER_STYLE}>Reason</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(flagset).map((flag) => {
            return (
              <tr key={flag.flagKey} style={BORDER_STYLE}>
                <td style={BORDER_STYLE}>{flag.flagKey}</td>
                <td style={BORDER_STYLE}>{flag.variationKey}</td>
                <td style={BORDER_STYLE}>
                  <code>{flag.reason}</code>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <h3>Evaluation Context</h3>
      <h3>Configuration</h3>
      <h3>Internal Data</h3>
      <table style={BORDER_STYLE}>
        <thead>
          <tr>
            <th style={BORDER_STYLE}>Key</th>
            <th style={BORDER_STYLE}>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(internalData).map((key) => {
            return (
              <tr key={key} style={BORDER_STYLE}>
                <td style={BORDER_STYLE}>{key}</td>
                <td style={BORDER_STYLE}>{internalData[key]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default PollingApp;
