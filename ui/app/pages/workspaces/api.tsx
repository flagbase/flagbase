import { axios } from '../../lib/axios'

export interface AccessToken {
    expiresAt: Date
    id: string
    accessToken: string
}

export const fetchAccessToken = async (key: string, secret: string): Promise<AccessToken> => {
    const result = await axios.post(`/access/token`, {
        key,
        secret,
    })

    return {
        expiresAt: result.data.access.expiresAt,
        id: result.data.access.id,
        accessToken: result.data.token,
    }
}

export interface Workspace {
    type: string
    id: string
    attributes: {
        description: string
        key: string
        name: string
        tags: string[]
    }
}

export const fetchWorkspaces = async () => {
    const result = await axios.get<Workspace[]>(`/workspaces`)
    return result.data
}

export const updateWorkspace = async ({
    workspaceKey,
    path,
    value,
}: {
    workspaceKey: string
    path: string
    value: string
}) => {
    return axios.patch(
        `/workspaces/${workspaceKey}`,
        {
            op: 'replace',
            path,
            value,
        },
        {
            headers: {
                'Access-Control-Allow-Methods': 'GET, PUT, POST, PATCH, DELETE',
            },
        }
    )
}

export const deleteWorkspace = async (workspaceKey: string) => {
    return axios.delete(`/workspaces/${workspaceKey}`)
}

export const createWorkspace = async ({
    name,
    description,
    tags,
}: {
    name: string
    description: string
    tags: string[]
}) => {
    return axios.post(`/workspaces`, {
        key: name.toLowerCase().replace(' ', '-'),
        name,
        description,
        tags,
    })
}
