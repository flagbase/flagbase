import Context, { Config, Flag, Identity, REASONS } from "../context";
import Transport from "../transport";

function Client(config: Config, identity?: Identity) {
  const context = new Context(config, identity);
  const transport = new Transport(context);
  transport.start();

  return {
    GetFlag: (
      flagKey: string,
      defaultVariationKey: string
    ): Flag["variationKey"] => {
      const defaultVariationValue = {
        flagKey,
        variationKey: defaultVariationKey,
        reason: REASONS.DEFAULT_FALLTHROUGH,
      };
      if (!!context.getFlag(flagKey)) {
        context.setFlag(flagKey, defaultVariationValue);
      } else if (
        context.getFlag(flagKey)?.reason === REASONS.DEFAULT_FALLTHROUGH
      ) {
        context.setFlag(flagKey, defaultVariationValue);
        return defaultVariationKey;
      }
      return context.getFlag(flagKey)?.variationKey || defaultVariationKey;
    },
  };
}

export default Client;
