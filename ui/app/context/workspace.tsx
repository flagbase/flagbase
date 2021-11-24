import { createEntityContext } from '../lib/entity-store';

export type Workspace = {
  id: string;
  key: string;
  attributes: {
    name: string;
    description: string;
    key: string;
    tags: string[];
  }
};

const WorkspaceStore = createEntityContext<Workspace>('workspace', {

});

export const WorkspaceContext = WorkspaceStore.Context;

export const WorkspaceProvider = WorkspaceStore.Provider;
