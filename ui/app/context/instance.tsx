import React, { createContext, useState } from 'react';

import {
  EntityStore,
  EntityActions,
  createStore,
  createActions
} from '../lib/entity-store';

export type Instance = {
  id: string;
  key: string;
  connectionString: string;
  accessKey: string;
  accessToken: string;
};

type InstanceStore = EntityStore<Instance>;

const intialState: InstanceStore = createStore();

export const InstanceContext = createContext<
  InstanceStore & Partial<EntityActions<Instance>>
>(intialState);

const InstanceProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<InstanceStore>(intialState);
  const actions = createActions<Instance>(state, setState);

  return (
    <InstanceContext.Provider
      value={{
        ...state,
        ...actions
      }}
    >
      {children}
    </InstanceContext.Provider>
  );
};

export default InstanceProvider;
