import { createEntityContext } from '../lib/entity-store';

export type Workspace = {
  id: string;
  key: string;
};

const WorkspaceStore = createEntityContext<Workspace>('workspace', {
  entities: {
    2: {
      id: '2',
      key: 'test'
    }
  }
});

export const WorkspaceContext = WorkspaceStore.Context;

export const WorkspaceProvider = WorkspaceStore.Provider;
