import Axios from 'axios'

export const changeBaseURL = (url: string) => {
    Axios.defaults.baseURL = url
}

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
