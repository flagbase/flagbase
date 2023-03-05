import React from 'react'
import { useParams } from 'react-router-dom'
import MainWorkspaces from './workspaces.main'
import Instances, { useInstances } from '../instances/instances'

const Workspaces: React.FC = () => {
    const { instanceKey } = useParams<{ instanceKey: string; activeTab: string }>()
    const { data: instances, isLoading } = useInstances({
        select: (instances: Instances) => {
            return instances.filter((instance) => instance.key.toLocaleLowerCase() === instanceKey?.toLocaleLowerCase())
        },
    })

    return <div className="mt-5">{!isLoading && <MainWorkspaces instances={instances} />}</div>
}

export default Workspaces
