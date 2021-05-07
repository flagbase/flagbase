import Context, { Flagset, Flag, IContext } from "../context";

export interface IApi {
  variation: (
    flagKey: string,
    defaultVariationKey: string
  ) => Flag["variationKey"];
  getAllFlags: () => Flagset;
}

export default function Api(context: IContext): IApi {
  const variation: IApi["variation"] = (flagKey, defaultVariationKey) => {
    return context.getFlag(flagKey)?.variationKey || defaultVariationKey;
  };

  const getAllFlags: IApi["getAllFlags"] = (): Flagset => context.getAllFlags();

  return {
    variation,
    getAllFlags,
  };
}
