import Client, {
    ClientOptions,
    IClient
} from './client';
import Context, {
    IContext,
    Mode,
    Config,
    DEFAULT_CONFIG,
    Evaluations,
    Flag,
    Flagset,
    REASONS,
    Identity,
    DEFAULT_IDENTITY,
    InternalData,
    DEFAULT_INTERNAL_DATA
} from './context';
import Events, {
    EventConsumer,
    EventProducer,
    EventType
} from './events';

export {
    IClient,
    Context,
    IContext,
    Mode,
    DEFAULT_CONFIG,
    REASONS,
    DEFAULT_IDENTITY,
    DEFAULT_INTERNAL_DATA,
    Events,
    EventConsumer,
    EventProducer,
    EventType
};
export type {
    ClientOptions,
    Config,
    Evaluations,
    Flag,
    Flagset,
    Identity,
    InternalData
};
export default Client;