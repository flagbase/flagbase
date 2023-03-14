import { useContext } from "react";
import FlagbaseContext from './context';

const useFeatureFlag = (flagKey: string, defaultVariationKey: string) => {
    const { flagbaseClient } = useContext(FlagbaseContext);
    return (
      flagbaseClient?.variation(flagKey, defaultVariationKey) ||
      defaultVariationKey
    );
};

export default useFeatureFlag;