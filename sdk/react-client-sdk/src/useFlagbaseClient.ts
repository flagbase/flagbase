import { useContext } from "react";
import FlagbaseContext from './context';

const useFlagbaseClient = () => {
    const { flagbaseClient } = useContext(FlagbaseContext);
    return flagbaseClient;
};
  
export default useFlagbaseClient;