import React, { useEffect, useState } from "react";
import FlagbaseClient, {
  IClient,
  ClientOptions,
  Flagset,
  IConfigPolling,
  Identity,
} from "../src/index";

const BORDER_STYLE = { border: "1px solid black" };

export type PollingAppProps = {
  clientKey: string;
  identity: Identity;
  opts: ClientOptions;
};

const PollingApp: React.FC<PollingAppProps> = (props) => {
  const [flagset, setFlagset] = useState<Flagset>({});

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
    }, (props.opts as IConfigPolling)?.pollIntervalMilliseconds || 1000);

    return function cleanup() {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <h3>Flagset</h3>
      <table style={BORDER_STYLE}>
        <thead>
          <th style={BORDER_STYLE}>Flag</th>
          <th style={BORDER_STYLE}>Variation</th>
          <th style={BORDER_STYLE}>Reason</th>
        </thead>
        <tbody>
          {Object.keys(flagset).length > 0 ? Object.values(flagset).map((flag) => {
            return (
              <tr key={flag.flagKey} style={BORDER_STYLE}>
                <td style={BORDER_STYLE}>{flag.flagKey}</td>
                <td style={BORDER_STYLE}>{flag.variationKey}</td>
                <td style={BORDER_STYLE}>
                  <code>{flag.reason}</code>
                </td>
              </tr>
            );
          }) : (<code>No flags</code>)}
        </tbody>
      </table>
    </>
  );
};

export default PollingApp;
