import React, { Suspense } from 'react'
import { useLoaderData, useParams } from 'react-router-dom'
import { Alert } from 'antd'
import { constants as instanceConstants } from '../instances/instances.constants'
import MainWorkspaces from './workspaces.main'
import Instances, { useInstances } from '../instances/instances'

const Workspaces: React.FC = () => {
    const { instanceKey } = useParams<{ instanceKey: string; activeTab: string }>()
    const loader = useLoaderData()
    console.log('loader', loader)
    const { data: instances, isLoading } = useInstances({
        select: (instances: Instances) => {
            return instances.filter((instance) => instance.key.toLocaleLowerCase() === instanceKey?.toLocaleLowerCase())
        },
    })

    return <div className="mt-5">{!isLoading && <MainWorkspaces instances={instances} />}</div>
}

export default Workspaces
