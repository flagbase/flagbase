import { axios } from '../../lib/axios'

export type SDK = {
    id: string
    type: 'sdk_key'
    attributes: {
        enabled: boolean
        clientKey: string
        serverKey: string
        expiresAt: number
        name: string
        description: string
        tags: string[]
    }
}

export const fetchSdkList = async ({
    workspaceKey,
    projectKey,
    environmentKey,
}: {
    workspaceKey: string
    projectKey: string
    environmentKey: string
}) => {
    const result = await axios.get<SDK[]>(
        `/projects/${workspaceKey}/${projectKey}/environments/${environmentKey}/sdk-keys`
    )
    return result.data
}

export interface CreateSdkKeyRequest {
    enabled?: boolean
    expiresAt?: number
    name: string
    tags: string[]
    description?: string
}

export const createSdkKey = async ({
    workspaceKey,
    projectKey,
    environmentKey,
    sdkKeyRequest,
}: {
    workspaceKey: string
    projectKey: string
    environmentKey: string
    sdkKeyRequest: CreateSdkKeyRequest
}) => {
    const result = await axios.post(
        `/projects/${workspaceKey}/${projectKey}/environments/${environmentKey}/sdk-keys`,
        sdkKeyRequest
    )

    return result.data
}
