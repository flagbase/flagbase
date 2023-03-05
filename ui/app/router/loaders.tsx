import { QueryClient } from 'react-query'

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

export const workspacesLoader = async ({ params }: { params: { instanceKey: string } }) => {
    const { instanceKey } = params
    return [instanceKey]
    // return queryClient.fetchQuery(['workspaces', instance.key], {
    //     queryFn: () => {
    //         axios.defaults.baseURL = instance.connectionString
    //         axios.defaults.headers.common['Authorization'] = `Bearer ${instance.accessToken}`
    //         return fetchWorkspaces(instance.connectionString, instance.accessToken)
    //     },
    // })
}
