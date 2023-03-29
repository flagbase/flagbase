import React from 'react'
import { useQuery } from 'react-query'
import { useFlagbaseParams } from '../lib/use-flagbase-params'

const Notifications = () => {
    const { instanceKey, workspaceKey } = useFlagbaseParams()

    const { isSuccess, isError } = useQuery({
        queryKey: ['projects', instanceKey, workspaceKey],
    })

    console.log('test', isSuccess, isError)

    return <></>
}

export default Notifications
