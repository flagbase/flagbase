import { QueryClient } from 'react-query'
import { defer } from 'react-router-dom'
import { Instance } from '../context/instance'
import { configureAxios } from '../lib/axios'
import { FlagbaseParams } from '../lib/use-flagbase-params'
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

export const getSdkKey = ({ instanceKey, workspaceKey, projectKey, environmentKey }: FlagbaseParams) => {
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