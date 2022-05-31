import React, { createContext, Reducer, useReducer, useState } from 'react'

import { createStore, EntityStore, ReducerEntityStore } from './entity-store'
import { createActions, createLocalStorageActions, EntityActions } from './entity-actions'
import useLocalStorage from '@rehooks/local-storage'

type Options = {
    useLocalStorage?: boolean
}

type EntityStoreWithActions<Entity> = EntityStore<Entity> & EntityActions<Entity>

type EntityContext<Entity> = {
    Context: React.Context<EntityStoreWithActions<Entity>>
    Provider: React.FC
}

function reducer<Entity>(state: EntityStore<Entity>, action: Partial<EntityStore<Entity>>) {
    return {
        ...state,
        ...action,
    }
}

function createEntityContext<Entity>(
    entityKey: string,
    initialState?: Partial<EntityStore<Entity>> | undefined,
    opts?: Options
): EntityContext<Entity> {
    const _intialState = createStore(initialState)

    const Context = createContext<EntityStoreWithActions<Entity>>({
        ..._intialState,
        ...createActions<Entity>({} as EntityStore<Entity>, () => {}),
    })

    const Provider: React.FC = ({ children }) => {
        if (opts?.useLocalStorage) {
            const [state, setState] = useLocalStorage<EntityStore<Entity>>(entityKey, _intialState)
            const actions = createLocalStorageActions<Entity>(state, setState)
            return (
                <Context.Provider
                    value={{
                        ...state,
                        ...actions,
                    }}
                >
                    {children}
                </Context.Provider>
            )
        } else {
            const [state, setState] = useReducer<Reducer<EntityStore<Entity>, Partial<EntityStore<Entity>>>>(
                reducer,
                _intialState
            )
            const actions = createActions<Entity>(state, setState)
            return (
                <Context.Provider
                    value={{
                        ...state,
                        ...actions,
                    }}
                >
                    {children}
                </Context.Provider>
            )
        }
    }

    Context.displayName = entityKey

    return {
        Context,
        Provider,
    }
}

export default createEntityContext
