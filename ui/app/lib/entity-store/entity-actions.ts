import { Entity, EntityStore } from "./entity-store";

export type EntityActions<T> = {
  addEntity: (entity: Entity<T>) => void;
  addEntities: (entities: { [entityId: string]: Entity<T> }) => void;
  removeEntity: (entityId: string) => void;
  clearEntities: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string) => void;
  setSelectedEntityId: (selectedEntityId: string) => void;
  selectEntity: (entity: Entity<T>) => void;
  getEntity: (entityId: string) => Entity<T> | undefined;
};

export const createActions = <T>(
  state: EntityStore<T>,
  setState: (state: EntityStore<T>) => void
): EntityActions<T> => ({
  addEntity: (entity: Entity<T>) =>
    setState({
      ...state,
      entities: { ...state.entities, [entity.id]: entity },
    }),
  addEntities: (entities: { [entityId: string]: Entity<T> }) =>
    setState({ ...state, entities: { ...state.entities, ...entities } }),
  removeEntity: (entityId: string) =>
    setState({
      ...state,
      entities: { ...state.entities, [entityId]: undefined },
    }),
  clearEntities: () =>
    setState({
      ...state,
      entities: {},
      selectedEntityId: null,
    }),
  setLoading: (isLoading = true) => setState({ ...state, isLoading }),
  setError: (error: string) => setState({ ...state, error }),
  setSelectedEntityId: (selectedEntityId: string) =>
    setState({ ...state, selectedEntityId }),
  selectEntity: (entity: Entity<T>) =>
    setState({ ...state, selectedEntityId: entity.id }),
  getEntity: (entityId: string): Entity<T> | undefined =>
    state.entities[entityId],
});
