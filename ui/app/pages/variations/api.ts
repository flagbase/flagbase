import { createPatch } from 'rfc6902'
import { axios } from '../../lib/axios'
import { FlagbaseParams } from '../../lib/use-flagbase-params'

type Variation = {
    type: 'variation'
    id: string
    attributes: {
        description: string
        key: string
        name: string
        tags: string[]
    }
}

export type VariationCreateBody = {
    key: string
    name: string
    description: string
    tags: string[]
}

export const fetchVariations = async ({
    workspaceKey,
    projectKey,
    flagKey,
}: {
    workspaceKey: string
    projectKey: string
    flagKey: string
}): Promise<Variation[]> => {
    const { data } = await axios.get(`/flags/${workspaceKey}/${projectKey}/${flagKey}/variations`)
    return data
}

export const createVariation = async ({
    workspaceKey,
    projectKey,
    flagKey,
    variation,
}: {
    workspaceKey: string
    projectKey: string
    flagKey: string
    variation: VariationCreateBody
}): Promise<Variation> => {
    const { data } = await axios.post(`/flags/${workspaceKey}/${projectKey}/${flagKey}/variations`, variation)
    return data
}

export type VariationUpdateBody = {
    key: string
    name: string
    description: string
    tags: string[]
}

export const updateVariation = async (
    {
        workspaceKey,
        projectKey,
        flagKey,
        variationKey,
    }: {
        workspaceKey: string
        projectKey: string
        flagKey: string
        variationKey: string
    },
    oldTargeting: VariationUpdateBody,
    newTargeting: VariationUpdateBody
): Promise<{ data: any }> => {
    const request = createPatch(oldTargeting, newTargeting)
    return axios.patch(`flags/${workspaceKey}/${projectKey}/${flagKey}/variations/${variationKey}`, request)
}

export const deleteVariation = async ({
    workspaceKey,
    projectKey,
    flagKey,
    variationKey,
}: {
    workspaceKey: string
    projectKey: string
    flagKey: string
    variationKey: string
}): Promise<void> => {
    await axios.delete(`/flags/${workspaceKey}/${projectKey}/${flagKey}/variations/${variationKey}`)
}
