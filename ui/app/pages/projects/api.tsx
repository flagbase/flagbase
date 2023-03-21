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
    return axios.delete(`/projects/${ProjectKey}`, {
        headers: {
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE',
        },
    })
}

export const createProject = async (name: string, description: string, tags: string[], workspaceKey: string) => {
    return axios.post(`/projects/${workspaceKey}`, {
        key: name.toLowerCase().replace(' ', '-'),
        name,
        description,
        tags,
    })
}

export const fetchEnvironments = async (workspaceKey: string, projectsKey: string) => {
    if (!workspaceKey || !projectsKey) return Promise.reject('Missing workspaceKey or projectsKey')
    const result = await axios.get(`/projects/${workspaceKey}/${projectsKey}/environments`)
    return result.data
}

export const deleteEnvironment = async ({
    workspaceKey,
    projectKey,
    environmentKey,
}: {
    workspaceKey: string
    projectKey: string
    environmentKey: string
}) => {
    return axios.delete(`/projects/${workspaceKey}/${projectKey}/environments/${environmentKey}`)
}

export const updateEnvironment = async ({
    workspaceKey,
    projectKey,
    environmentKey,
    body,
}: {
    workspaceKey: string
    projectKey: string
    environmentKey: string
    body: UpdateBody[]
}) => {
    return axios.patch(`/projects/${workspaceKey}/${projectKey}/environments/${environmentKey}`, body)
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
