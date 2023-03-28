import React from 'react';
import FlagbaseProvider from '../../src'
import Navigation from './Navigation';

const App = () => (
  <FlagbaseProvider
    clientKey="sdk-client_9722ab62-b9e5-45b0-8124-bdec6ce18bc3"
    identity={{ identifier: "liya", traits: { "some-trait-key": "some-trait-value" }}}
    opts={{ pollingIntervalMs: 3000 }}
  >
    <Navigation />
  </FlagbaseProvider>
);

export default App;