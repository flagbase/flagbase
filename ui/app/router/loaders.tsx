import { QueryClient } from 'react-query'
import { Instance } from '../context/instance'
import { axios } from '../lib/axios'
import { fetchWorkspaces } from '../pages/workspaces/api'

export const getInstances = () => JSON.parse(localStorage.getItem('instances') || '[]')

const instancesQuery = () => ({
    queryKey: ['instances'],
    queryFn: async () => getInstances(),
})

// ⬇️ needs access to queryClient
export const instancesLoader = (queryClient: QueryClient) => async () => {
    const query = instancesQuery()
    // ⬇️ return data or fetch it
    return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query))
}

const getInstance = (instanceKey: string) => getInstances().find((instance) => instance.key === instanceKey)
export const workspacesLoader = async ({
    queryClient,
    params,
}: {
    queryClient: QueryClient
    params: { instanceKey: string }
}) => {
    const { instanceKey } = params
    const instances = queryClient.getQueryData(['instances']) ?? (await queryClient.fetchQuery(instancesQuery()))
    const instance = instances.find(
        (instance: Instance) => instance.key.toLocaleLowerCase() === instanceKey.toLocaleLowerCase()
    )

    if (!instance) {
        throw new Error('Instance not found')
    }
    const workspaces = await queryClient.fetchQuery(['workspaces', instanceKey.toLocaleLowerCase()], {
        queryFn: () => {
            axios.defaults.baseURL = instance.connectionString
            axios.defaults.headers.common['Authorization'] = `Bearer ${instance.accessToken}`
            return fetchWorkspaces(instance.connectionString)
        },
    })
    return { workspaces, instance }
}
