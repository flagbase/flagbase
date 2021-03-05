import React, { createContext, useState } from 'react';
import useLocalStorage from '@rehooks/local-storage';

import { createStore, EntityStore } from './entity-store';
import { createActions, EntityActions } from './entity-actions';

type Options = {
  useLocalStorage?: boolean;
};

type EntityContext<Entity> = {
  Context: React.Context<EntityStore<Entity> & Partial<EntityActions<Entity>>>;
  Provider: React.FC;
};

function createEntityContext<Entity> (
  entityKey: string,
  initialState?: Partial<EntityStore<Entity>> | undefined,
  opts?: Options
): EntityContext<Entity> {
  const _intialState = createStore(initialState);

  const Context = createContext<
    EntityStore<Entity> & Partial<EntityActions<Entity>>
  >(_intialState);

  const Provider: React.FC = ({ children }) => {
    const [state, setState] = opts?.useLocalStorage
      ? useLocalStorage<EntityStore<Entity>>(entityKey, _intialState)
      : useState<EntityStore<Entity>>(_intialState);

    const actions = createActions<Entity>(state, setState);
    return (
      <Context.Provider
        value={{
          ...state,
          ...actions
        }}
      >
        {children}
      </Context.Provider>
    );
  };

  Context.displayName = entityKey;

  return {
    Context,
    Provider
  };
}

export default createEntityContext;
