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
    })
    return query
}

const WorkspacesError = () => {
    const error = useAsyncError() as any
    const errors = error?.response?.data?.errors || []
    return (
        <ul role="list" className="-my-5 divide-y divide-gray-200">
            {errors.map((error) => (
                <li key={error.code} className="py-5">
                    <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                        <h3 className="text-sm font-semibold text-gray-800">
                            <span>
                                {/* Extend touch target to entire panel */}
                                <span className="absolute inset-0" aria-hidden="true" />
                                {error.code}
                            </span>
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{error.message}</p>
                    </div>
                </li>
            ))}
        </ul>
    )
}

const MainWorkspaces = () => {
    const { instanceKey } = useParams() as { instanceKey: string }
    const { instance } = useLoaderData() as { workspaces: Workspace[]; instance: Instance }
    const [createWorkspace, showCreateWorkspace] = useState(false)
    const [filter, setFilter] = useState('')
    const { data: workspaces } = useWorkspaces(instanceKey)
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Await resolve={instance} errorElement={<WorkspacesError />}>
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
