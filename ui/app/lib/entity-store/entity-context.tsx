import React, { createContext, useState } from 'react';

import { createStore, EntityStore } from "./entity-store";
import { createActions, EntityActions } from "./entity-actions";

type Options = {
  useLocalStorage?: boolean;
};

type EntityStoreWithActions<Entity> = EntityStore<Entity> &
  EntityActions<Entity>;

type EntityContext<Entity> = {
  Context: React.Context<EntityStoreWithActions<Entity>>;
  Provider: React.FC;
};

type Action =
 | { type: 'add', payload: any }
 | { type: 'delete', results: string }
 | { type: 'failure', error: string };

function reducer<Entity>(state: Partial<EntityStore<Entity>>, action: Action) {
  console.log("Reducer called", state, action)
  switch (action.type) {
    case 'add':
      return {
        ...state, ...action.payload
      };
    case 'delete':
      return {...state};
    default:
      throw new Error();
  }
}

function createEntityContext<Entity>(
  entityKey: string,
  initialState?: Partial<EntityStore<Entity>> | undefined,
  opts?: Options
): EntityContext<Entity> {
  const _intialState = createStore(initialState);

  const Context = createContext<EntityStoreWithActions<Entity>>({
    ..._intialState,
    ...createActions<Entity>({} as EntityStore<Entity>, () => {}),
  });

  const Provider: React.FC = ({ children }) => {
    const [state, setState] = useState<EntityStore<Entity>>(_intialState);
    // TODO: use @rehooks/local-storage to persist state to localstorage.
    // opts?.useLocalStorage
    // ? useLocalStorage<EntityStore<Entity>>(entityKey, _intialState)
    // : useState<EntityStore<Entity>>(_intialState);

    const actions = createActions<Entity>(state, setState);
    return (
      <Context.Provider
        value={{
          ...state,
          ...actions,
        }}
      >
        {children}
      </Context.Provider>
    );
  };

  Context.displayName = entityKey;

  return {
    Context,
    Provider,
  };
}

export default createEntityContext;
