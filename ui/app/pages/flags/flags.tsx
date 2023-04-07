import { PlusCircleIcon } from '@heroicons/react/20/solid'
import React, { Suspense, useState } from 'react'
import { useQueryClient, useMutation, useQuery } from 'react-query'
import { Await, Link, useLoaderData } from 'react-router-dom'
import Button from '../../../components/button'
import EmptyState from '../../../components/empty-state'
import { Loader } from '../../../components/loader'
import Table from '../../../components/table/table'
import Tag from '../../../components/tag'
import Text from '../../../components/text/text'
import { configureAxios } from '../../lib/axios'
import { useFlagbaseParams } from '../../lib/use-flagbase-params'
import { getFlagsKey } from '../../router/loaders'
import { useActiveEnvironment, useUpdateActiveEnvironment } from '../environments/environment-dropdown'
import { Environment, useEnvironments } from '../environments/environments'
import { createFlag, deleteFlag, fetchFlags, Flag, FlagCreateBody, updateFlag } from './api'
import { flagConstants, flagsColumn } from './constants'
import { CreateFlag } from './flags.modal'

export const useChangeDefaultEnvironment = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (newEnvironment: Environment) => {
            return newEnvironment
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['defaultEnvironment'])
        },
    })
    return mutation
}

const FlagLink = ({ flag }: { flag: Flag }) => {
    const { data: environmentKey, isLoading } = useActiveEnvironment()
    const { data: environments } = useEnvironments()
    const environment = environments?.find((env) => env.attributes.key === environmentKey)

    if (isLoading) {
        return <Loader />
    }
    return (
        <Link to={`${flag.attributes.key}/environments/${environment?.attributes.key}`}>
            <Button secondary className="py-2">
                Modify
            </Button>
        </Link>
    )
}
const convertFlags = ({ flags, environment }: { flags: Flag[]; environment: Environment }) => {
    if (!flags) {
        return []
    }

    return Object.values(flags).map((flag: Flag, index: number) => {
        return {
            id: index,
            key: flag.attributes.key,
            title: flag.attributes.name,
            href: `${flag.attributes.key}/environments/${environment?.attributes.key}`,
            name: <Text>{flag.attributes.name}</Text>,
            description: <Text>{flag.attributes.description}</Text>,
            tags: (
                <div>
                    {(flag.attributes.tags || []).map((tag) => (
                        <Tag key={tag} className="mr-2">
                            {tag}
                        </Tag>
                    ))}
                </div>
            ),
            action: <FlagLink flag={flag} />,
            flagKey: flag.attributes.key,
        }
    })
}

export const useUpdateFlag = () => {
    const queryClient = useQueryClient()
    const { workspaceKey, projectKey, environmentKey, instanceKey, flagKey } = useFlagbaseParams()
    const mutation = useMutation({
        mutationFn: async (values: { description: string; tags: string[]; name: string; key: string }) => {
            await configureAxios(instanceKey!)
            await updateFlag({
                workspaceKey: workspaceKey!,
                projectKey: projectKey!,
                environmentKey: environmentKey!,
                flagKey: flagKey!,
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
            queryClient.invalidateQueries({
                queryKey: getFlagsKey({
                    instanceKey: instanceKey!,
                    workspaceKey: workspaceKey!,
                    projectKey: projectKey!,
                }),
            })
        },
    })
    return mutation
}

export const useRemoveFlag = () => {
    const { instanceKey, workspaceKey, projectKey, flagKey } = useFlagbaseParams()

    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async () => {
            await configureAxios(instanceKey!)
            return deleteFlag({
                workspaceKey: workspaceKey!,
                projectKey: projectKey!,
                flagKey: flagKey!,
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getFlagsKey({
                    instanceKey: instanceKey!,
                    workspaceKey: workspaceKey!,
                    projectKey: projectKey!,
                }),
            })
        },
    })
    return mutation
}

export const useAddFlag = () => {
    const { instanceKey, workspaceKey, projectKey } = useFlagbaseParams()
    const queryClient = useQueryClient()
    return useMutation(
        (flag: FlagCreateBody) => createFlag({ workspaceKey: workspaceKey!, projectKey: projectKey!, flag }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(getFlagsKey({ instanceKey, workspaceKey, projectKey }))
            },
        }
    )
}

export const useFlags = () => {
    const { instanceKey, workspaceKey, projectKey } = useFlagbaseParams()
    const query = useQuery<Flag[]>(
        getFlagsKey({
            instanceKey,
            workspaceKey,
            projectKey,
        }),
        {
            queryFn: async () => {
                await configureAxios(instanceKey!)
                return fetchFlags({ workspaceKey, projectKey })
            },
            enabled: !!workspaceKey && !!projectKey,
            refetchOnWindowFocus: false,
        }
    )
    return query
}

const Flags: React.FC = () => {
    const [visible, setVisible] = useState(false)
    const { flags: prefetchedFlags } = useLoaderData() as { flags: Flag[] }
    const { data: environmentKey } = useActiveEnvironment()
    const { mutate } = useUpdateActiveEnvironment()
    const { data: environments } = useEnvironments()

    if (!environmentKey && environments?.length) {
        mutate(environments[0].attributes.key)
    }

    const activeEnvironment = environments?.find((env) => env.attributes.key === environmentKey)

    const { data: flags } = useFlags()
    return (
        <Suspense fallback={<Loader />}>
            <Await resolve={prefetchedFlags}>
                {() => (
                    <div className="mt-5">
                        <CreateFlag visible={visible} setVisible={setVisible} />
                        <Table
                            loading={false}
                            dataSource={convertFlags({ flags, environment: activeEnvironment })}
                            columns={flagsColumn}
                            emptyState={
                                <EmptyState
                                    title="No Flags"
                                    description={'Get started by creating a new flag.'}
                                    cta={
                                        <Button
                                            className="py-2"
                                            suffix={PlusCircleIcon}
                                            onClick={() => setVisible(true)}
                                        >
                                            {flagConstants.FLAG_ADD_TEXT}
                                        </Button>
                                    }
                                />
                            }
                        />
                    </div>
                )}
            </Await>
        </Suspense>
    )
}

export default Flags
