import React, { useEffect, useState } from "react";
import FlagbaseClient, {
  IClient,
  ClientOptions,
  Flagset,
  Identity,
  InternalData,
  EventType,
} from "../src/index";

const BORDER_STYLE = { border: "1px solid black" };

const FLAGBASE_EVENT_PREFIX = "Flagbase: ";

export type PollingAppProps = {
  clientKey: string;
  identity: Identity;
  opts: ClientOptions;
};

type DebugLog = {
  time: Date;
  type: EventType;
  message: string;
};

const PollingApp: React.FC<PollingAppProps> = (props) => {
  const [debugLog, setDebugLog] = useState<DebugLog[]>([]);

  const [flagset, setFlagset] = useState<Flagset>({});
  const [internalData, setInternalData] = useState<InternalData>({
    consecutiveCachedRequests: 0,
    consecutiveFailedRequests: 0,
    flagsetChanges: 0,
  });

  let flagbaseClient: IClient;

  const addDebugLog = (eventType: EventType, eventMessage: string) => {
    const newEntry: DebugLog = {
      time: new Date(),
      type: eventType,
      message: eventMessage,
    };
    setDebugLog((prevDebugLog) => [...prevDebugLog, newEntry]);
    console.log(newEntry, debugLog.length);
  };

  useEffect(() => {
    flagbaseClient = FlagbaseClient(
      props.clientKey,
      props.identity,
      props.opts
    );

    flagbaseClient.on(EventType.CLIENT_READY, (eventMessage) => {
      addDebugLog(EventType.CLIENT_READY, eventMessage);
    });

    flagbaseClient.on(EventType.FLAG_CHANGE, (eventMessage) => {
      addDebugLog(EventType.FLAG_CHANGE, eventMessage);
      setFlagset(flagbaseClient.getAllFlags());
    });

    flagbaseClient.on(EventType.NETWORK_FETCH, () => {
      setInternalData(flagbaseClient.getInternalData());
    });

    flagbaseClient.on(EventType.NETWORK_FETCH_FULL, (eventMessage) => {
      addDebugLog(EventType.NETWORK_FETCH_FULL, eventMessage);
    });

    flagbaseClient.on(EventType.NETWORK_FETCH_CACHED, (eventMessage) => {
      addDebugLog(EventType.NETWORK_FETCH_CACHED, eventMessage);
    });

    flagbaseClient.on(EventType.NETWORK_FETCH_ERROR, (eventMessage) => {
      addDebugLog(EventType.NETWORK_FETCH_ERROR, eventMessage);
    });

    flagbaseClient.on(EventType.CLIENT_READY, (eventMessage) => {
      addDebugLog(EventType.CLIENT_READY, eventMessage);
    });

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
      <h3>Internal Stats</h3>
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
      <h3>Debug logs</h3>
      <table style={BORDER_STYLE}>
        <thead>
          <tr>
            <th style={BORDER_STYLE}>Timestamp</th>
            <th style={BORDER_STYLE}>Type</th>
            <th style={BORDER_STYLE}>Message</th>
          </tr>
        </thead>
        <tbody>
          {debugLog
            .sort((a, b) => b.time.getTime() - a.time.getTime())
            .map(({ time, type, message }) => {
              return (
                <tr key={time.toISOString()} style={BORDER_STYLE}>
                  <td style={BORDER_STYLE}>{time.getTime()}</td>
                  <td style={BORDER_STYLE}>{type}</td>
                  <td style={BORDER_STYLE}>{message}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};

export default PollingApp;
