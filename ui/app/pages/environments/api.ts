import { axios } from '../../lib/axios'
import { UpdateBody } from '../workspaces/api'

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
