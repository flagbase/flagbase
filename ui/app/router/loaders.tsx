import { QueryClient } from 'react-query'
import { defer } from 'react-router-dom'
import { Instance } from '../context/instance'
import { configureAxios } from '../lib/axios'
import { fetchEnvironments, fetchProjects } from '../pages/projects/api'
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

export const workspaceQuery = ({
    instanceKey,
    connectionString,
    accessToken,
}: {
    instanceKey: string
    connectionString: string
    accessToken: string
}) => ({
    queryKey: ['workspaces', instanceKey.toLocaleLowerCase()],
    queryFn: async () => {
        await configureAxios(instanceKey)
        return fetchWorkspaces(connectionString)
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
    const { connectionString, accessToken } = instance
    const workspaces = queryClient.fetchQuery(workspaceQuery({ instanceKey, connectionString, accessToken }))
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
    const [instance] = await instancesQuery(queryClient, instanceKey)
    const projects = queryClient.fetchQuery(['projects', instanceKey, workspaceKey], {
        queryFn: async () => {
            const { connectionString, accessToken } = instance
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
