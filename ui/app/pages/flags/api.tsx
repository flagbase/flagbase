import { axios } from '../../lib/axios'

export type Flag = {
    id: string
    type: 'flag'
    attributes: {
        key: string
        name: string
        description: string
        tags: string[]
    }
}

export const createFlag = async ({
    workspaceKey,
    projectKey,
    flag,
}: {
    workspaceKey: string
    projectKey: string
    flag: Flag
}): Promise<Flag> => {
    const { data } = await axios.post(`/flags/${workspaceKey}/${projectKey}`, flag)
    return data
}

export const fetchFlags = async ({
    workspaceKey,
    projectKey,
}: {
    workspaceKey: string
    projectKey: string
}): Promise<Flag[]> => {
    const { data } = await axios.get(`/flags/${workspaceKey}/${projectKey}`)
    return data
}
