export type Entity<T> = {
  id: string;
} & T;

export type Entities<T> = {
  [itemId: string]:
    | undefined
    | Entity<T>;
};

export type EntityStore<T> = {
  entities: Entities<T>;
  selectedEntityId: string | null;
  isLoading: boolean;
  error: string | null;
};

export const createStore = <T = void>(
  initialState?: Partial<EntityStore<T>>
): EntityStore<T> => ({
    entities: {},
    selectedEntityId: null,
    isLoading: false,
    error: null,
    ...initialState
  });
