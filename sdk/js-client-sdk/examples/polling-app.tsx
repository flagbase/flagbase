import React, { useEffect, useState } from "react";
import FlagbaseClient, {
  IClient,
  ClientOptions,
  Flagset,
  IConfigPolling,
  Identity,
  InternalData,
  EventType,
} from "../src/index";

const BORDER_STYLE = { border: "1px solid black" };

const FLAGBASE_EVENT_PREFIX = "Flagbase: "

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

  let flagbaseClient: IClient;

  useEffect(() => {
    flagbaseClient = FlagbaseClient(
      props.clientKey,
      props.identity,
      props.opts
    );

    flagbaseClient.on(EventType.CLIENT_READY, (eventMessage) => {
      console.debug(FLAGBASE_EVENT_PREFIX, eventMessage)
    })

    flagbaseClient.on(EventType.FLAG_CHANGE, (eventMessage) => {
      console.debug(FLAGBASE_EVENT_PREFIX, eventMessage)
      setFlagset(flagbaseClient.getAllFlags());
    })

    flagbaseClient.on(EventType.NETWORK_FETCH, (eventMessage) => {
      console.debug(FLAGBASE_EVENT_PREFIX, eventMessage)
      setInternalData(flagbaseClient.getInternalData());
    })

    return function cleanup() {
      flagbaseClient.destroy();
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
