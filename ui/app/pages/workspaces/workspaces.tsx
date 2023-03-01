import React from 'react'
import { useParams } from 'react-router-dom'
import { Alert } from 'antd'
import { constants as instanceConstants } from '../instances/instances.constants'
import MainWorkspaces from './workspaces.main'
import EditInstance from './workspaces.edit'
import Instances, { useInstances } from '../instances/instances'

const Workspaces: React.FC = () => {
    const { instanceKey, activeTab } = useParams<{ instanceKey: string; activeTab: string }>()

    const { data: instances, isLoading } = useInstances({
        select: (instances: Instances) => {
            return instances.filter((instance) => instance.key.toLocaleLowerCase() === instanceKey?.toLocaleLowerCase())
        },
    })

    if (isLoading) {
        return <Alert message={instanceConstants.loading} />
    }

    if (!instanceKey || !instances) {
        return <Alert message={instanceConstants.error} />
    }

    if (activeTab === 'settings') {
        return <EditInstance instanceKey={instanceKey} />
    }

    return (
        <div className="mt-5">
            <MainWorkspaces instances={instances} />
        </div>
    )
}

export default Workspaces
