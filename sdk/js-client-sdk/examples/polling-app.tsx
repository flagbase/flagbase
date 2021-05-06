import React, { useEffect, useState } from "react";
import FlagbaseClient, { Mode } from "../src/index";

const PollingApp: React.FC = () => {
  const [flagValue, setFlagValue] = useState("some-test");

  const flagbase = FlagbaseClient(
    {
      mode: Mode.POLLING,
      endpointUri: "http://127.0.0.1:9051",
      clientKey: "sdk-client_4fbb5464-0a71-4fb0-9268-b426d6b710e5",
      pollIntervalMilliseconds: 5000
    },
    {
      identifier: "cool-user",
      traits: {
        "some-trait-key": "aaaa",
      },
    }
  );

  useEffect(() => {
    setTimeout(() => {
      setFlagValue(flagbase.GetFlag("test-flag", "some-random-value"));
    }, 2000);
  }, []);

  return <>Test: {flagValue}</>;
};

export default PollingApp;
