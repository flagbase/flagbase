import Context, {
  Flagset,
  Identity,
  Flag,
  IContext,
  InternalData,
} from "../context";

export interface IApi {
  variation: (
    flagKey: string,
    defaultVariationKey: string
  ) => Flag["variationKey"];
  getAllTraits: () => Identity["traits"];
  getTrait: (traitKey: string) => string | number;
  setTrait: (traitKey: string, traitValue: string | number) => void;
  getAllFlags: () => Flagset;
  getInternalData: () => InternalData;
}

export default function Api(context: IContext): IApi {
  const variation: IApi["variation"] = (flagKey, defaultVariationKey) => {
    return context.getFlag(flagKey)?.variationKey || defaultVariationKey;
  };

  const getAllTraits: IApi["getAllTraits"] = () => context.getIdentityTraits();

  const getTrait: IApi["getTrait"] = (traitKey) => getAllTraits()[traitKey];

  const setTrait: IApi["setTrait"] = (traitKey, traitValue) =>
    context.setIdentityTraits({ [traitKey]: traitValue });

  const getAllFlags: IApi["getAllFlags"] = () => context.getAllFlags();

  const getInternalData: IApi["getInternalData"] = () =>
    context.getInternalData();

  return {
    variation,
    getAllTraits,
    getTrait,
    setTrait,
    getAllFlags,
    getInternalData,
  };
}
