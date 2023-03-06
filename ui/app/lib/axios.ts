import Axios from 'axios'
import { Instance } from '../context/instance'
import { getInstances } from '../router/loaders'
import { queryClient } from '../router/router'

export const axios = Axios.create()

axios.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        const message = error.response?.data?.message || error.message
        console.log(message)
        return Promise.reject(error)
    }
)
axios.defaults.baseURL = 'http://localhost:3000/'

export const configureAxios = async (instanceKey: string) => {
    const instances = await queryClient.fetchQuery({
        queryKey: ['instances'],
        queryFn: () => getInstances(),
    })
    const instance = instances?.find(
        (instance: Instance) => instance.key.toLocaleLowerCase() === instanceKey.toLocaleLowerCase()
    )
    if (!instance) {
        throw new Error('Instance not found')
    }

    axios.defaults.baseURL = instance?.connectionString
    axios.defaults.headers.common['Authorization'] = `Bearer ${instance?.accessToken}`
}
