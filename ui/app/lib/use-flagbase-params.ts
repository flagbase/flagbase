import { useParams } from 'react-router-dom'

export type FlagbaseParams = {
    instanceKey: string
    workspaceKey: string
    projectKey: string
    flagKey: string
    environmentKey: string
    sdkKey: string
    ruleKey: string
    variationKey: string
}

export const useFlagbaseParams = () => {
    const params = useParams<FlagbaseParams>()
    return params
}
