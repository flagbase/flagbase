import React, { useEffect, useState } from "react";
import FlagbaseClient, { ClientOptions, Flagset, Identity } from "../src/index";

export type PollingAppProps = {
  clientKey: string;
  identity: Identity;
  opts: ClientOptions;
};

const PollingApp: React.FC<PollingAppProps> = (props) => {
  const [flagKey, setFlagKey] = useState("some-test");
  const [flagset, setFlagset] = useState<Flagset>({});

  let interval;

  let flagbaseClient: FlagbaseClient;

  useEffect(() => {
    flagbaseClient = new FlagbaseClient(
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
    }, 100);

    return function cleanup() {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <h3>Flagset</h3>
      <table style={{ border: "1px solid black" }}>
        <tr>
          <th>Flag</th>
          <th>Variation</th>
          <th>Reason</th>
        </tr>
        {Object.values(flagset).map((flag) => {
          return (
            <tr style={{ border: "1px solid black" }}>
              <td style={{ border: "1px solid black" }}>{flag.flagKey}</td>
              <td style={{ border: "1px solid black" }}>{flag.variationKey}</td>
              <td style={{ border: "1px solid black" }}>
                <code>{flag.reason}</code>
              </td>
            </tr>
          );
        })}
      </table>
    </>
  );
};

export default PollingApp;
