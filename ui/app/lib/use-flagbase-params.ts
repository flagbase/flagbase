import { useParams } from 'react-router-dom'

export type FlagbaseParams = {
    instanceKey: string | undefined
    workspaceKey: string | undefined
    projectKey: string | undefined
    environmentKey: string | undefined
    sdkKey: string | undefined
}

export const useFlagbaseParams = () => {
    const params = useParams() as FlagbaseParams
    return params
}
