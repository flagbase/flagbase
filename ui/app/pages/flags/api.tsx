import { axios } from '../../lib/axios'
import { FlagbaseParams } from '../../lib/use-flagbase-params'

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

export type FlagCreateBody = {
    key: string
    name: string
    description?: string
    tags?: string
}

export const createFlag = async ({
    workspaceKey,
    projectKey,
    flag,
}: {
    workspaceKey: string
    projectKey: string
    flag: FlagCreateBody
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

export const fetchTargeting = async ({
    workspaceKey,
    projectKey,
    environmentKey,
    flagKey,
}: Partial<FlagbaseParams>) => {
    const { data } = await axios.get(`/targeting/${workspaceKey}/${projectKey}/${environmentKey}/${flagKey}`)
    return data
}

export const fetchTargetingRules = async ({
    workspaceKey,
    projectKey,
    environmentKey,
    flagKey,
}: Partial<FlagbaseParams>) => {
    const { data } = await axios.get(`/targeting/${workspaceKey}/${projectKey}/${environmentKey}/${flagKey}/rules`)
    return data
}

export const fetchTargetingRule = async ({
    workspaceKey,
    projectKey,
    environmentKey,
    flagKey,
    ruleKey,
}: Partial<FlagbaseParams>) => {
    const { data } = await axios.get(
        `/targeting/${workspaceKey}/${projectKey}/${environmentKey}/${flagKey}/rules/${ruleKey}`
    )
    return data
}

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

export type Operator = 'equals' | 'contains' | 'greaterThan' | 'greaterThanOrEqual' | 'contains' | 'regex'

export type TargetingRuleRequest = {
    key: string
    name: string
    description: string
    tags: string[]
    type: string
    traitKey?: string
    traitValue?: string
    operator: Operator
    ruleVariations: {
        variationKey: string
        weight: number
    }[]
    segmentKey?: string
}

export type TargetingRuleResponse = {
    key: string | null | undefined
    type: 'targeting_rule'
    id: string
    attributes: {
        description: string
        key: string
        name: string
        operator: Operator
        ruleVariations: {
            variationKey: string
            weight: number
        }[]
        segmentKey?: string
        tags: string[]
        traitKey?: string
        traitValue?: string
        type: 'trait'
    }
}

export const createTargetingRule = async (
    { workspaceKey, projectKey, environmentKey, flagKey }: Partial<FlagbaseParams>,
    request: TargetingRuleRequest
): Promise<{ data: TargetingRuleResponse }> => {
    return axios.post(`/targeting/${workspaceKey}/${projectKey}/${environmentKey}/${flagKey}/rules`, request)
}

export const deleteTargetingRule = async (
    { workspaceKey, projectKey, environmentKey, flagKey, ruleKey }: Partial<FlagbaseParams>
): Promise<{ data: TargetingRuleResponse }> => {
    return axios.delete(`/targeting/${workspaceKey}/${projectKey}/${environmentKey}/${flagKey}/rules/${ruleKey}`)
}
