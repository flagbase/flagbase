import Axios from 'axios'

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
