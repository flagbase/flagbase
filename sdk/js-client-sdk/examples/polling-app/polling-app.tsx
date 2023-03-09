import React, { useEffect, useState } from "react";
import FlagbaseClient, {
  IClient,
  ClientOptions,
  Flagset,
  Identity,
  InternalData,
  EventType,
} from "../../src/index";

const BORDER_STYLE = { border: "1px solid black" };

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
  const [flagbaseClient, setFlagbaseClient] = useState<IClient>();
  const [debugLog, setDebugLog] = useState<DebugLog[]>([]);
  const [identifier, setIdentifier] = useState<Identity["identifier"]>(
    props["identity"]["identifier"]
  );
  const [traits, setTraits] = useState<Identity["traits"]>(
    props["identity"]["traits"]
  );

  const [flagset, setFlagset] = useState<Flagset>({});
  const [internalData, setInternalData] = useState<InternalData>({
    consecutiveCachedRequests: 0,
    consecutiveFailedRequests: 0,
    flagsetChanges: 0,
  });

  useEffect(() => {
    const _flagbaseClient = FlagbaseClient(
      props.clientKey,
      props.identity,
      props.opts
    );
    setFlagbaseClient(_flagbaseClient);

    _flagbaseClient.on(EventType.CLIENT_READY, (eventMessage) => {
      addDebugLog(EventType.CLIENT_READY, eventMessage);
    });

    _flagbaseClient.on(EventType.FLAG_CHANGE, (eventMessage) => {
      addDebugLog(EventType.FLAG_CHANGE, eventMessage);
      setFlagset(_flagbaseClient.getAllFlags());
    });

    _flagbaseClient.on(EventType.CONTEXT_CHANGE, (eventMessage) => {
      addDebugLog(EventType.CONTEXT_CHANGE, eventMessage);
      setIdentifier(_flagbaseClient.getIdentifier());
      setTraits(_flagbaseClient.getAllTraits());
    });

    _flagbaseClient.on(EventType.NETWORK_FETCH, () => {
      setInternalData(_flagbaseClient.getInternalData());
    });

    _flagbaseClient.on(EventType.NETWORK_FETCH_FULL, (eventMessage) => {
      addDebugLog(EventType.NETWORK_FETCH_FULL, eventMessage);
    });

    _flagbaseClient.on(EventType.NETWORK_FETCH_CACHED, (eventMessage) => {
      addDebugLog(EventType.NETWORK_FETCH_CACHED, eventMessage);
    });

    _flagbaseClient.on(EventType.NETWORK_FETCH_ERROR, (eventMessage) => {
      addDebugLog(EventType.NETWORK_FETCH_ERROR, eventMessage);
    });

    _flagbaseClient.on(EventType.CLIENT_READY, (eventMessage) => {
      addDebugLog(EventType.CLIENT_READY, eventMessage);
    });

    return () => _flagbaseClient.destroy();
  }, [props]);

  const addDebugLog = (eventType: EventType, eventMessage: string) => {
    const newEntry: DebugLog = {
      time: new Date(),
      type: eventType,
      message: eventMessage,
    };
    setDebugLog((prevDebugLog) => [...prevDebugLog, newEntry]);
  };

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
      <h3>Evaluated Context</h3>
      <h4>Identifier</h4>
      <input
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />
      <button onClick={() => flagbaseClient.setIdentifier(identifier)}>
        save
      </button>
      <h4>Traits</h4>
      <table style={BORDER_STYLE}>
        <thead>
          <tr>
            <th style={BORDER_STYLE}>Key</th>
            <th style={BORDER_STYLE}>Value</th>
            <th style={BORDER_STYLE}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(traits).map((traitKey) => {
            return (
              traits[traitKey] && (
                <tr key={traitKey} style={BORDER_STYLE}>
                  <td style={BORDER_STYLE}>{traitKey}</td>
                  <td style={BORDER_STYLE}>
                    <input
                      onChange={(e) => {
                        e?.target?.value &&
                          setTraits((prevTraits) => ({
                            ...prevTraits,
                            [traitKey]: e.target.value,
                          }));
                      }}
                      value={traits[traitKey]}
                    />
                  </td>
                  <td style={BORDER_STYLE}>
                    <button
                      onClick={() =>
                        flagbaseClient.setTrait(traitKey, traits[traitKey])
                      }
                    >
                      update
                    </button>
                    <button
                      onClick={() =>
                        flagbaseClient.setTrait(traitKey, undefined)
                      }
                    >
                      delete
                    </button>
                  </td>
                </tr>
              )
            );
          })}
        </tbody>
      </table>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const traitKey = e?.target[0]?.value;
          const traitValue = e?.target[1]?.value;
          flagbaseClient.setTrait(traitKey, traitValue);
        }}
      >
        <input name="traitKey" placeholder="traitKey" />
        <input name="traitValue" placeholder="traitValue" />
        <button type="submit">add</button>
      </form>
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
