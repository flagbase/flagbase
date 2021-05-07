import React, { useEffect, useState } from "react";
import FlagbaseClient, {
  IClient,
  ClientOptions,
  Flagset,
  IConfigPolling,
  Identity,
} from "../src/index";

export type PollingAppProps = {
  clientKey: string;
  identity: Identity;
  opts: ClientOptions;
};

const PollingApp: React.FC<PollingAppProps> = (props) => {
  const [flagKey, setFlagKey] = useState("some-test");
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
      setFlagKey(flagbaseClient.variation("test-flag", "some-random-value"));
      setFlagset(flagbaseClient.getAllFlags());
    }, (props.opts as IConfigPolling)?.pollIntervalMilliseconds || 1000);

    return function cleanup() {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <h3>Flagset</h3>
      <table style={{ border: "1px solid black" }}>
        <thead>
          <th>Flag</th>
          <th>Variation</th>
          <th>Reason</th>
        </thead>
        <tbody>
          {Object.values(flagset).map((flag) => {
            return (
              <tr key={flag.flagKey} style={{ border: "1px solid black" }}>
                <td style={{ border: "1px solid black" }}>{flag.flagKey}</td>
                <td style={{ border: "1px solid black" }}>
                  {flag.variationKey}
                </td>
                <td style={{ border: "1px solid black" }}>
                  <code>{flag.reason}</code>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default PollingApp;
