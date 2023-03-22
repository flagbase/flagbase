import { QueryClient } from 'react-query'
import { defer } from 'react-router-dom'
import { Instance } from '../context/instance'
import { configureAxios } from '../lib/axios'
import { FlagbaseParams } from '../lib/use-flagbase-params'
import { fetchFlags, fetchTargeting, fetchTargetingRules, fetchVariations } from '../pages/flags/api'
import { fetchEnvironments, fetchProjects } from '../pages/projects/api'
import { fetchSdkList } from '../pages/sdks/api'
import { fetchWorkspaces } from '../pages/workspaces/api'

export const getInstances = () => JSON.parse(localStorage.getItem('instances') || '[]')

export const instancesQuery = async (queryClient: QueryClient, instanceKey?: string): Promise<Instance[]> => {
    const instances = await queryClient.fetchQuery({
        queryKey: ['instances'],
        queryFn: async () => getInstances(),
    })
    if (instanceKey) {
        return instances.filter(
            (instance: Instance) => instance.key.toLocaleLowerCase() === instanceKey.toLocaleLowerCase()
        )
    }
    if (!instances.length) {
        throw new Error('No instances found')
    }
    return instances
}

export const instancesLoader = (queryClient: QueryClient) => async () => {
    // ⬇️ return data or fetch it
    const instances = queryClient.fetchQuery({
        queryKey: ['instances'],
        queryFn: () => getInstances(),
    })
    return defer({ instances })
}

export const workspaceQuery = ({ instanceKey }: { instanceKey: string }) => ({
    queryKey: ['workspaces', instanceKey.toLocaleLowerCase()],
    queryFn: async () => {
        await configureAxios(instanceKey)
        return fetchWorkspaces()
    },
})

export const workspacesLoader = async ({
    queryClient,
    params,
}: {
    queryClient: QueryClient
    params: { instanceKey: string }
}) => {
    const { instanceKey } = params
    const [instance] = await instancesQuery(queryClient, instanceKey)
    await configureAxios(instanceKey)
    const workspaces = queryClient.fetchQuery(workspaceQuery({ instanceKey }))
    return defer({ workspaces, instance })
}

export const projectsLoader = async ({
    queryClient,
    params,
}: {
    queryClient: QueryClient
    params: { instanceKey: string; workspaceKey: string }
}) => {
    const { instanceKey, workspaceKey } = params
    const projects = queryClient.fetchQuery(['projects', instanceKey, workspaceKey], {
        queryFn: async () => {
            await configureAxios(instanceKey)
            return fetchProjects(workspaceKey)
        },
    })
    return defer({ projects })
}

export const environmentsLoader = async ({
    queryClient,
    params,
}: {
    queryClient: QueryClient
    params: { instanceKey: string; workspaceKey: string; projectKey: string }
}) => {
    const { instanceKey, workspaceKey, projectKey } = params
    const environments = queryClient.fetchQuery(['environments', instanceKey, workspaceKey, projectKey], {
        queryFn: async () => {
            await configureAxios(instanceKey)
            return fetchEnvironments(workspaceKey, projectKey)
        },
    })
    return defer({ environments })
}

export const getSdkKey = ({
    instanceKey,
    workspaceKey,
    projectKey,
    environmentKey,
}: {
    instanceKey: string
    workspaceKey: string
    projectKey: string
    environmentKey: string
}) => {
    return ['sdks', instanceKey, workspaceKey, projectKey, environmentKey]
}

export const sdkLoader = async ({ queryClient, params }: { queryClient: QueryClient; params: FlagbaseParams }) => {
    const { instanceKey, workspaceKey, projectKey, environmentKey } = params
    if (!instanceKey || !workspaceKey || !projectKey || !environmentKey) {
        throw new Error('Missing params')
    }
    const queryKey = getSdkKey(params)
    const sdks = queryClient.fetchQuery(queryKey, {
        queryFn: async () => {
            await configureAxios(instanceKey)
            return fetchSdkList({
                environmentKey,
                projectKey,
                workspaceKey,
            })
        },
    })
    return defer({ sdks })
}

export const getFlagsKey = ({ instanceKey, workspaceKey, projectKey }: Partial<FlagbaseParams>) => {
    return ['flags', instanceKey, workspaceKey, projectKey]
}

export const getTargetingKey = ({ instanceKey, workspaceKey, projectKey, environmentKey, flagKey }: Partial<FlagbaseParams>) => {
    return ['targeting', instanceKey, workspaceKey, projectKey, environmentKey, flagKey]
}

export const getTargetingRulesKey = ({ instanceKey, workspaceKey, projectKey, environmentKey, flagKey }: Partial<FlagbaseParams>) => {
    return ['targeting','rules', instanceKey, workspaceKey, projectKey, environmentKey, flagKey]
}

export const flagsLoader = async ({ queryClient, params }: { queryClient: QueryClient; params: FlagbaseParams }) => {
    const { instanceKey, workspaceKey, projectKey } = params
    if (!workspaceKey || !projectKey || !instanceKey) {
        throw new Error('Missing params')
    }
    const queryKey = getFlagsKey(params)
    const flags = queryClient.fetchQuery(queryKey, {
        queryFn: async () => {
            await configureAxios(instanceKey)
            return fetchFlags({
                projectKey,
                workspaceKey,
            })
        },
    })
    return defer({ flags })
}

export const targetingLoader = async ({
    queryClient,
    params,
}: {
    queryClient: QueryClient
    params: FlagbaseParams
}) => {
    const { instanceKey, workspaceKey, projectKey, environmentKey, flagKey } = params
    if (!workspaceKey || !projectKey || !instanceKey || !flagKey) {
        throw new Error('Missing params')
    }
    if (!environmentKey) {
        return defer({ targeting: [] })
    }
    const variations = queryClient.fetchQuery(getVariationsKey({
        instanceKey,
        workspaceKey,
        projectKey,
        flagKey,    
    }), {
        queryFn: async () => {
            await configureAxios(instanceKey)
            return fetchVariations({
                workspaceKey,
                projectKey,
                flagKey,
            })
        },
    })
    const targeting = queryClient.fetchQuery(getTargetingKey(params), {
        queryFn: async () => {
            await configureAxios(instanceKey)
            return fetchTargeting({
                workspaceKey,
                projectKey,
                environmentKey,
                flagKey,
            })
        },
    });
    const targetingRules = queryClient.fetchQuery(getTargetingRulesKey(params), {
        queryFn: async () => {
            await configureAxios(instanceKey)
            return fetchTargetingRules({
                workspaceKey,
                projectKey,
                environmentKey,
                flagKey,
            })
        },
    });
    return defer({ targeting, targetingRules, variations })
}


export const targetingRulesLoader = async ({
    queryClient,
    params,
}: {
    queryClient: QueryClient
    params: FlagbaseParams
}) => {
    const { instanceKey, workspaceKey, projectKey, environmentKey, flagKey } = params
    if (!workspaceKey || !projectKey || !instanceKey || !flagKey) {
        throw new Error('Missing params')
    }
    if (!environmentKey) {
        return defer({ targeting: [] })
    }
    const queryKey = getTargetingKey(params)
    const targetingRules = queryClient.fetchQuery(queryKey, {
        queryFn: async () => {
            await configureAxios(instanceKey)
            return fetchTargetingRules({
                workspaceKey,
                projectKey,
                environmentKey,
                flagKey,
            })
        },
    });
    return defer({ targetingRules })
}

export const getVariationsKey = ({
    instanceKey,
    workspaceKey,
    projectKey,
    flagKey,
}: {
    instanceKey: string
    workspaceKey: string
    projectKey: string
    flagKey: string
}) => {
    return ['variations', instanceKey, workspaceKey, projectKey, flagKey]
}

export const variationsLoader = async ({
    queryClient,
    params,
}: {
    queryClient: QueryClient
    params: FlagbaseParams
}) => {
    const { instanceKey, workspaceKey, projectKey, flagKey } = params
    if (!workspaceKey || !projectKey || !instanceKey || !flagKey) {
        throw new Error('Missing params')
    }

    const queryKey = getVariationsKey(params)
    const variations = queryClient.fetchQuery(queryKey, {
        queryFn: async () => {
            await configureAxios(instanceKey)
            return fetchVariations({
                workspaceKey,
                projectKey,
                flagKey,
            })
        },
    })
    return defer({ variations })
}
