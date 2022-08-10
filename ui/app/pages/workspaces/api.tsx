import { axios } from '../../lib/axios'

interface AccessToken {
    expiresAt: Date
    token: string
    id: string
}

export const fetchAccessToken = async (url: string, key: string, secret: string): Promise<AccessToken> => {
    const result = await axios.post(`/access/token`, {
        key,
        secret,
    })

    return {
        expiresAt: result.data.data.access.expiresAt,
        token: result.data.data.token,
        id: result.data.data.access.id,
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

export interface WorkspaceResponse {
    data: Workspace[]
}

export const fetchWorkspaces = async (url: string, accessToken: string) => {
    const result = await axios.get<WorkspaceResponse>(`/workspaces`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    return result.data.data
}

export const deleteWorkspace = async (url: string, workspaceKey: string, accessToken: string) => {
    return axios.delete(`/workspaces/${workspaceKey}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE',
        },
    })
}

export const createWorkspace = async (
    url: string,
    name: string,
    description: string,
    tags: string[],
    accessToken: string
) => {
    return axios.post(
        `/workspaces`,
        {
            key: name.toLowerCase().replace(' ', '-'),
            name,
            description,
            tags,
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE',
            },
        }
    )
}
