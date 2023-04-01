import React, { Suspense, useState } from 'react'
import { Await, useLoaderData, useParams } from 'react-router-dom'
import Table from '../../../components/table/table'
import { createWorkspace, deleteWorkspace, fetchWorkspaces, updateWorkspace, Workspace } from './api'
import Button from '../../../components/button'
import { constants, workspaceColumns } from './workspace.constants'
import Input from '../../../components/input'
import { SearchOutlined } from '@ant-design/icons'
import { convertWorkspaces } from './workspaces.helpers'
import { CreateWorkspaceModal } from './workspace.modal'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import EmptyState from '../../../components/empty-state'
import { configureAxios } from '../../lib/axios'
import { Loader } from '../../../components/loader'
import { useFlagbaseParams } from '../../lib/use-flagbase-params'
import { Instance } from '../instances/instances.functions'
import { useNotification } from '../../hooks/use-notification'

export const useAddWorkspace = () => {
    const queryClient = useQueryClient()
    const notification = useNotification()
    const { instanceKey } = useFlagbaseParams()
    const mutation = useMutation({
        mutationFn: async (values: Omit<Workspace['attributes'], 'key'>) => {
            await createWorkspace({ name: values.name, description: values.description, tags: values.tags })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces', instanceKey] })
            notification.addNotification({
                type: 'success',
                title: 'Success',
                content: 'Workspace created',
            })
        },
    })
    return mutation
}
export const useUpdateWorkspace = (instanceKey: string | undefined) => {
    const queryClient = useQueryClient()
    const { workspaceKey } = useFlagbaseParams()
    const mutation = useMutation({
        mutationFn: async (values: { name: string; key: string; description: string; tags: string[] }) => {
            await configureAxios(instanceKey!)
            await updateWorkspace({
                workspaceKey: workspaceKey!,
                body: [
                    {
                        op: 'replace',
                        path: '/name',
                        value: values.name,
                    },
                    {
                        op: 'replace',
                        path: '/key',
                        value: values.key,
                    },
                    {
                        op: 'replace',
                        path: '/description',
                        value: values.description,
                    },
                    {
                        op: 'replace',
                        path: '/tags',
                        value: values.tags,
                    },
                ],
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces', instanceKey] })
        },
    })
    return mutation
}

export const useRemoveWorkspace = (instanceKey: string | undefined) => {
    const queryClient = useQueryClient()
    const notification = useNotification()
    const mutation = useMutation({
        mutationFn: async (key: string) => {
            await configureAxios(instanceKey!)
            return deleteWorkspace(key)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces', instanceKey?.toLocaleLowerCase()] })
            notification.addNotification({
                type: 'success',
                title: 'Success',
                content: 'Workspace deleted',
            })
        },
    })
    return mutation
}

export const useWorkspaces = (instanceKey: string | undefined, options?: any) => {
    const query = useQuery<Workspace[]>(['workspaces', instanceKey?.toLocaleLowerCase()], {
        queryFn: async () => {
            await configureAxios(instanceKey!)
            return fetchWorkspaces()
        },
        enabled: !!instanceKey,
        staleTime: Infinity,
    })
    return query
}

const MainWorkspaces = () => {
    const { instanceKey } = useParams() as { instanceKey: string }
    const { instance, workspaces: prefetchedWorkspaces } = useLoaderData() as {
        workspaces: Workspace[]
        instance: Instance
    }
    const [createWorkspace, showCreateWorkspace] = useState(false)
    const [filter, setFilter] = useState('')
    const { data: workspaces, isRefetching, isFetching, isLoading } = useWorkspaces(instanceKey)

    return (
        <Suspense fallback={<Loader />}>
            <Await resolve={prefetchedWorkspaces}>
                {() => (
                    <React.Fragment>
                        <CreateWorkspaceModal
                            visible={createWorkspace}
                            setVisible={showCreateWorkspace}
                            instance={instance}
                        />

                        <div className="flex flex-col-reverse md:flex-row gap-3 pb-5 items-stretch">
                            <div className="flex-auto">
                                <Input
                                    onChange={(event) => setFilter(event.target.value)}
                                    placeholder="Search"
                                    prefix={SearchOutlined}
                                />
                            </div>
                        </div>
                        <Table
                            loading={isFetching || isRefetching || isLoading}
                            dataSource={workspaces ? convertWorkspaces(workspaces, instance, filter.toLowerCase()) : []}
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
