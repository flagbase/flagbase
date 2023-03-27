import Context, { IContext } from './context';
import { Mode, Config, DEFAULT_CONFIG } from './config'
import { Evaluations, Flag, Flagset, REASONS } from './flags';
import { Identity, DEFAULT_IDENTITY } from './identity';
import { InternalData, DEFAULT_INTERNAL_DATA } from './internal-data';

export {
    IContext,
    Mode,
    DEFAULT_CONFIG,
    REASONS,
    DEFAULT_IDENTITY,    
    DEFAULT_INTERNAL_DATA
};
export type {
    Config,
    Evaluations,
    Flag,
    Flagset,
    Identity,
    InternalData
};
export default Context;