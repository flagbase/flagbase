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

type Action = { type: 'add'; payload: any } | { type: 'delete'; results: string } | { type: 'failure'; error: string }

function reducer<Entity>(state: Partial<EntityStore<Entity>>, action: Action) {
    switch (action.type) {
        case 'add':
            return {
                ...state,
                ...action.payload,
            }
        case 'delete':
            return { ...state }
        default:
            throw new Error()
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
        const [state, setState] = opts?.useLocalStorage
            ? useLocalStorage<EntityStore<Entity>>(entityKey, _intialState)
            : useReducer<Reducer<ReducerEntityStore<Entity>, Action>>(reducer, _intialState)

        const actions = opts?.useLocalStorage
            ? createLocalStorageActions<Entity>(state, setState)
            : createActions<Entity>(state, setState)
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

    Context.displayName = entityKey

    return {
        Context,
        Provider,
    }
}

export default createEntityContext
