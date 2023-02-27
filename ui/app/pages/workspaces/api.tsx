import { axios } from '../../lib/axios'

interface AccessToken {
    expiresAt: Date
    token: string
    id: string
    accessToken: string
}

export const fetchAccessToken = async (url: string, key: string, secret: string): Promise<AccessToken> => {
    const result = await axios.post(`/access/token`, {
        key,
        secret,
    })

    return {
        expiresAt: result.data.access.expiresAt,
        token: result.data.token,
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

export const fetchWorkspaces = async (url: string, accessToken: string) => {
    const result = await axios.get<Workspace[]>(`${url}/workspaces`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    return result.data
}

export const deleteWorkspace = async (workspaceKey: string) => {
    return axios.delete(`/workspaces/${workspaceKey}`, {
        headers: {
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
