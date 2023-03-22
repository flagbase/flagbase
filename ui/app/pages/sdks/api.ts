import { axios } from '../../lib/axios'
import { UpdateBody } from '../workspaces/api'

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
    body,
}: {
    workspaceKey: string
    projectKey: string
    environmentKey: string
    body: CreateSdkKeyRequest
}) => {
    const result = await axios.post(
        `/projects/${workspaceKey}/${projectKey}/environments/${environmentKey}/sdk-keys`,
        body
    )

    return result.data
}

export const deleteSdk = async ({
    workspaceKey,
    projectKey,
    environmentKey,
    sdkId,
}: {
    workspaceKey: string
    projectKey: string
    environmentKey: string
    sdkId: string
}) => {
    const result = await axios.delete(
        `/projects/${workspaceKey}/${projectKey}/environments/${environmentKey}/sdk-keys/${sdkId}`
    )

    return result.data
}

export const updateSdk = async ({
    workspaceKey,
    projectKey,
    environmentKey,
    sdkId,
    body,
}: {
    workspaceKey: string
    projectKey: string
    environmentKey: string
    sdkId: string
    body: UpdateBody[]
}) => {
    return axios.patch(`/projects/${workspaceKey}/${projectKey}/environments/${environmentKey}/sdk-keys/${sdkId}`, body)
}
