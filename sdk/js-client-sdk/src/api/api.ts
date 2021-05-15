import Context, {
  Flagset,
  Identity,
  Flag,
  IContext,
  InternalData,
} from "../context";
import { EventProducer, EventType } from "../events";

export interface IApi {
  variation: (
    flagKey: string,
    defaultVariationKey: string
  ) => Flag["variationKey"];
  getIdentifier: () => Identity["identifier"];
  setIdentifier: (identifier: string) => void;
  getAllTraits: () => Identity["traits"];
  getTrait: (traitKey: string) => string | number;
  setTrait: (traitKey: string, traitValue: string | number) => void;
  getAllFlags: () => Flagset;
  getInternalData: () => InternalData;
}

export default function Api(context: IContext, events: EventProducer): IApi {
  const variation: IApi["variation"] = (flagKey, defaultVariationKey) => {
    return context.getFlag(flagKey)?.variationKey || defaultVariationKey;
  };

  const getIdentifier: IApi["getIdentifier"] = () =>
    context.getIdentity()["identifier"];

  const setIdentifier: IApi["setIdentifier"] = (identifier) => {
    context.setIdentity({ identifier });
    events.emit(
      EventType.CONTEXT_CHANGE,
      `Updated identifier, identifier=${identifier}`,
      getIdentifier()
    );
  };

  const getAllTraits: IApi["getAllTraits"] = () => context.getIdentityTraits();

  const getTrait: IApi["getTrait"] = (traitKey) => getAllTraits()[traitKey];

  const setTrait: IApi["setTrait"] = (traitKey, traitValue) => {
    context.setIdentityTraits({ [traitKey]: traitValue });
    events.emit(
      EventType.CONTEXT_CHANGE,
      `Updated trait, ${traitKey}=${JSON.stringify(traitValue)}`,
      getAllTraits()
    );
  };

  const getAllFlags: IApi["getAllFlags"] = () => context.getAllFlags();

  const getInternalData: IApi["getInternalData"] = () =>
    context.getInternalData();

  return {
    variation,
    getIdentifier,
    setIdentifier,
    getAllTraits,
    getTrait,
    setTrait,
    getAllFlags,
    getInternalData,
  };
}
