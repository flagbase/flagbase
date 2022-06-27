import { createEntityContext } from '../lib/entity-store'

export type Attributes = {
    name: string
    description: string
    key: string
    tags: string[]
}
export type Project = {
    id: string
    key: string
    attributes: Attributes
}

const ProjectStore = createEntityContext<Project>('project', {})

export const ProjectContext = ProjectStore.Context

export const ProjectProvider = ProjectStore.Provider
