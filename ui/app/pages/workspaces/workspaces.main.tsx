import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { PlusCircleOutlined } from '@ant-design/icons'
import { Alert, notification } from 'antd'
import Table from '../../../components/table/table'
import { Instance } from '../../context/instance'
import { Workspace } from '../../context/workspace'
import { createWorkspace, deleteWorkspace, fetchWorkspaces } from './api'
import Button from '../../../components/button'
import { constants, workspaceColumns } from './workspace.constants'
import { constants as instanceConstants } from '../instances/instances.constants'
import Input from '../../../components/input'
import { SearchOutlined } from '@ant-design/icons'
import { convertWorkspaces } from './workspaces.helpers'
import { CreateWorkspace } from './modal'
import Instances, { useInstances } from '../instances/instances'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { axios } from '../../lib/axios'
import { PlusCircleIcon } from '@heroicons/react/24/outline'

type MainWorkspacesType = {
    instances: Instances
}

export const useAddWorkspace = (instance: Instance) => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (values: Omit<Workspace['attributes'], 'key'>) => {
            await createWorkspace(
                instance.connectionString,
                values.name,
                values.description,
                values.tags,
                instance.accessToken
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces', instance.key] })
        },
    })
    return mutation
}

export const useRemoveWorkspace = (instance: Instance) => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (key: string) => {
            deleteWorkspace(key)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces', instance.key] })
        },
    })
    return mutation
}

export const useWorkspaces = (instanceKey: string, options?: any) => {
    const { data: instances } = useInstances({
        select: (instances: Instance[]) =>
            instances.filter((i) => i.key.toLocaleLowerCase() === instanceKey?.toLocaleLowerCase()),
        enabled: !!instanceKey,
    })
    const [instance] = instances || []

    const query = useQuery<Workspace | Workspace[]>(['workspaces', instance?.key], {
        ...options,
        queryFn: () => fetchWorkspaces(instance.connectionString, instance.accessToken),
        onSuccess: () => {
            axios.defaults.baseURL = instance.connectionString
            axios.defaults.headers.common['Authorization'] = `Bearer ${instance.accessToken}`
        },
        enabled: !!instance?.key,
    })
    return query
}

const MainWorkspaces: React.FC<MainWorkspacesType> = ({ instances }) => {
    const { instanceKey } = useParams<{ instanceKey: string }>()

    if (!instanceKey) {
        return <Alert message={instanceConstants.error} type="error" />
    }

    const [visible, setVisible] = useState(false)
    const [filter, setFilter] = useState('')

    const instance = instances && instances.length > 0 ? instances[0] : null

    if (!instance) {
        return <Alert message={instanceConstants.error} type="error" />
    }

    const { data: workspaces, isError, isLoading } = useWorkspaces(instance.key)

    if (isError) {
        notification.error({
            message: constants.error,
        })
    }

    return (
        <React.Fragment>
            <CreateWorkspace visible={visible} setVisible={setVisible} instance={instance} />

            <div className="flex flex-col-reverse md:flex-row gap-3 items-center pb-5">
                <Button
                    onClick={() => setVisible(true)}
                    type="button"
                    suffix={<PlusCircleIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />}
                >
                    {constants.create}
                </Button>
                <div className="flex-auto">
                    <Input
                        onChange={(event) => setFilter(event.target.value)}
                        placeholder="Search"
                        prefix={<SearchOutlined />}
                    />
                </div>
            </div>
            <Table
                loading={isLoading}
                dataSource={workspaces ? convertWorkspaces(workspaces, instance, filter) : []}
                columns={workspaceColumns}
            />
        </React.Fragment>
    )
}

export default MainWorkspaces
