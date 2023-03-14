import React, { useState, useEffect } from "react";
import FlagbaseClient, {
  IClient,
  Identity,
  ClientOptions,
  EventType,
} from "@flagbase/js-client-sdk";
import FlagbaseContext from "./context";

export type FlagbaseProviderProps = {
  children: React.ReactNode;
  clientKey: string;
  identity: Identity;
  opts: ClientOptions;
};

const FlagbaseProvider: React.FC<FlagbaseProviderProps> = ({
  children,
  clientKey,
  identity,
  opts,
}) => {
  const [flagbaseClient, setFlagbaseClient] = useState<IClient>(
    undefined as any
  );
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isDestroyed, setIsDestroyed] = useState<boolean>(false);

  useEffect(() => {
    const _flagbaseClient = FlagbaseClient(clientKey, identity, opts);
    setFlagbaseClient(_flagbaseClient);
    setIsDestroyed(false);

    _flagbaseClient.on(EventType.CLIENT_READY, () => {
      setIsReady(true);
    });

    return () => {
      if (!isDestroyed) {
        setIsDestroyed(true);
        _flagbaseClient.destroy();
      }
    };
  }, [clientKey, identity, opts]);

  return (
    <FlagbaseContext.Provider value={{ flagbaseClient, isReady, isDestroyed }}>
      {children}
    </FlagbaseContext.Provider>
  );
};

export default FlagbaseProvider;
