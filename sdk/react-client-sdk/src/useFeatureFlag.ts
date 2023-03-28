import { EventType } from "@flagbase/js-client-sdk";
import { useContext, useState } from "react";
import FlagbaseContext from "./context";

const useFeatureFlag = (flagKey: string, defaultVariationKey: string) => {
  const { flagbaseClient } = useContext(FlagbaseContext);
  const [flagset, setFlagset] = useState(flagbaseClient?.getAllFlags() || {});

  flagbaseClient?.on("flag_change" as EventType, () => {
    setFlagset(flagbaseClient?.getAllFlags());
  });

  return flagset[flagKey]?.variationKey || defaultVariationKey;
};

export default useFeatureFlag;
