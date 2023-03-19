import { useParams } from 'react-router-dom'

export type FlagbaseParams = {
    instanceKey: string | undefined
    workspaceKey: string | undefined
    projectKey: string | undefined
    flagKey: string | undefined
    environmentKey: string | undefined
    sdkKey: string | undefined
    ruleKey: string | undefined
}

export const useFlagbaseParams = () => {
    const params = useParams() as FlagbaseParams
    return params
}
