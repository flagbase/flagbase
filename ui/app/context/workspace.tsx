import { createEntityContext } from '../lib/entity-store'
import { Workspace } from '../pages/workspaces/api'

const WorkspaceStore = createEntityContext<Workspace>('workspace', {})

export const WorkspaceContext = WorkspaceStore.Context

export const WorkspaceProvider = WorkspaceStore.Provider
