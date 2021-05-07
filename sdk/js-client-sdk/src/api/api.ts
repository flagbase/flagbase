import Context, { Flagset, Flag, IContext, InternalData } from "../context";

export interface IApi {
  variation: (
    flagKey: string,
    defaultVariationKey: string
  ) => Flag["variationKey"];
  getAllFlags: () => Flagset;
  getInternalData: () => InternalData;
}

export default function Api(context: IContext): IApi {
  const variation: IApi["variation"] = (flagKey, defaultVariationKey) => {
    return context.getFlag(flagKey)?.variationKey || defaultVariationKey;
  };

  const getAllFlags: IApi["getAllFlags"] = () => context.getAllFlags();

  const getInternalData: IApi["getInternalData"] = () =>
    context.getInternalData();

  return {
    variation,
    getAllFlags,
    getInternalData,
  };
}
