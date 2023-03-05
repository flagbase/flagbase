import React, { Suspense, useState } from 'react'
import { Await, useLoaderData } from 'react-router-dom'
import Table from '../../../components/table/table'
import { Instance } from '../../context/instance'
import { createWorkspace, deleteWorkspace, fetchWorkspaces, Workspace } from './api'
import Button from '../../../components/button'
import { constants, workspaceColumns } from './workspace.constants'
import Input from '../../../components/input'
import { SearchOutlined } from '@ant-design/icons'
import { convertWorkspaces } from './workspaces.helpers'
import { CreateWorkspace } from './modal'
import { useInstances } from '../instances/instances'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { axios } from '../../lib/axios'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import EmptyState from '../../../components/empty-state'

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
        queryFn: () => {
            axios.defaults.baseURL = instance.connectionString
            axios.defaults.headers.common['Authorization'] = `Bearer ${instance.accessToken}`
            return fetchWorkspaces(instance.connectionString)
        },
        enabled: !!instance?.key,
    })
    return query
}

const MainWorkspaces = () => {
    const { workspaces, instance } = useLoaderData() as { workspaces: Workspace[]; instance: Instance }

    const [createWorkspace, showCreateWorkspace] = useState(false)
    const [filter, setFilter] = useState('')

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Await resolve={workspaces} errorElement={<p>Error loading package location!</p>}>
                {(workspaces) => (
                    <React.Fragment>
                        <CreateWorkspace
                            visible={createWorkspace}
                            setVisible={showCreateWorkspace}
                            instance={instance}
                        />

                        <div className="flex flex-col-reverse md:flex-row gap-3 pb-5 items-stretch">
                            <Button onClick={() => showCreateWorkspace(true)} type="button" suffix={PlusCircleIcon}>
                                {constants.create}
                            </Button>
                            <div className="flex-auto">
                                <Input
                                    onChange={(event) => setFilter(event.target.value)}
                                    placeholder="Search"
                                    prefix={SearchOutlined}
                                />
                            </div>
                        </div>
                        <Table
                            loading={false}
                            dataSource={workspaces ? convertWorkspaces(workspaces, instance, filter) : []}
                            columns={workspaceColumns}
                            emptyState={
                                <EmptyState
                                    title="No workspaces found"
                                    description="This workspace does not have any workspaces yet."
                                    cta={
                                        <Button
                                            onClick={() => showCreateWorkspace(true)}
                                            className="py-2"
                                            suffix={PlusCircleIcon}
                                        >
                                            {constants.create}
                                        </Button>
                                    }
                                />
                            }
                        />
                    </React.Fragment>
                )}
            </Await>
        </Suspense>
    )
}

export default MainWorkspaces
