import { axios } from '../../lib/axios'
import { UpdateBody } from '../workspaces/api'

export interface Project {
    type: string
    id: string
    attributes: {
        description: string
        key: string
        name: string
        tags: string[]
    }
}
export interface ProjectResponse {
    data: Project[]
}

export const fetchProjects = async (workspaceKey: string) => {
    const result = await axios.get<ProjectResponse>(`/projects/${workspaceKey}`)
    return result.data
}

export const deleteProject = async (ProjectKey: string) => {
    return axios.delete(`/projects/${ProjectKey}`)
}

export const createProject = async (name: string, description: string, tags: string[], workspaceKey: string) => {
    return axios.post(`/projects/${workspaceKey}`, {
        key: name.toLowerCase().replace(' ', '-'),
        name,
        description,
        tags,
    })
}

export const updateProject = async ({
    workspaceKey,
    projectKey,
    body,
}: {
    workspaceKey: string
    projectKey: string
    body: UpdateBody[]
}) => {
    return axios.patch(`/projects/${workspaceKey}/${projectKey}`, body)
}
