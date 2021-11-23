import axios from "axios"

export const fetchAccessToken = (url:string, key:string, secret:string) => {
    axios.post(`${url}/access/token`, {
        body: {
            key,
            secret
        }
    }).then((result) => {
        console.log(result)
    })
}