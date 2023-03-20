import React, { Suspense, useState } from 'react'
import { Await, useAsyncError, useLoaderData, useParams } from 'react-router-dom'
import Table from '../../../components/table/table'
import { Instance } from '../../context/instance'
import { createWorkspace, deleteWorkspace, fetchWorkspaces, updateWorkspace, Workspace } from './api'
import Button from '../../../components/button'
import { constants, workspaceColumns } from './workspace.constants'
import Input from '../../../components/input'
import { SearchOutlined } from '@ant-design/icons'
import { convertWorkspaces } from './workspaces.helpers'
import { CreateWorkspace } from './modal'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import EmptyState from '../../../components/empty-state'
import { configureAxios } from '../../lib/axios'
import { Loader } from '../../../components/loader'

export const useAddWorkspace = (instance: Instance) => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (values: Omit<Workspace['attributes'], 'key'>) => {
            await createWorkspace({ name: values.name, description: values.description, tags: values.tags })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces', instance.key.toLocaleLowerCase()] })
        },
    })
    return mutation
}
export const useUpdateWorkspace = (instanceKey: string | undefined) => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async ({ workspaceKey, path, value }: { workspaceKey: string; path: string; value: string }) => {
            await configureAxios(instanceKey!)
            return updateWorkspace({
                workspaceKey,
                path,
                value,
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
    const mutation = useMutation({
        mutationFn: async (key: string) => {
            await configureAxios(instanceKey!)
            return deleteWorkspace(key)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces', instanceKey?.toLocaleLowerCase()] })
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
                            loading={isFetching || isRefetching || isLoading}
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
