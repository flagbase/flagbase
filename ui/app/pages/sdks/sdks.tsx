import { DocumentDuplicateIcon, PlusCircleIcon } from '@heroicons/react/20/solid'
import React, { Suspense, useState } from 'react'
import { useQuery } from 'react-query'
import { Await, Link, useLoaderData } from 'react-router-dom'
import Button from '../../../components/button'
import EmptyState from '../../../components/empty-state'
import { StackedEntityList, StackedEntityListProps } from '../../../components/list/stacked-list'
import { Loader } from '../../../components/loader'
import { Notification } from '../../../components/notification/notification'
import Table from '../../../components/table/table'
import Tag from '../../../components/tag'
import { configureAxios } from '../../lib/axios'
import { FlagbaseParams, useFlagbaseParams } from '../../lib/use-flagbase-params'
import { getSdkKey } from '../../router/loaders'
import { fetchSdkList, SDK } from './api'
import { AddNewSDKModal } from './sdks.modal'

export const sdkColumns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Client Key',
        dataIndex: 'clientKey',
        key: 'clientKey',
    },
    {
        title: 'Server Key',
        dataIndex: 'serverKey',
        key: 'serverKey',
    },

    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Tags',
        dataIndex: 'tags',
        key: 'tags',
    },
    {
        title: 'Actions',
        dataIndex: 'action',
        key: 'action',
    },
]

export const useSDKs = ({ instanceKey, workspaceKey, projectKey, environmentKey }: Partial<FlagbaseParams>) => {
    const queryKey = getSdkKey({
        instanceKey: instanceKey!,
        workspaceKey: workspaceKey!,
        projectKey: projectKey!,
        environmentKey: environmentKey!,
    })
    const query = useQuery<SDK[]>(queryKey, {
        queryFn: async () => {
            await configureAxios(instanceKey!)
            return fetchSdkList({
                workspaceKey: workspaceKey!,
                projectKey: projectKey!,
                environmentKey: environmentKey!,
            })
        },
        enabled: !!instanceKey,
        staleTime: Infinity,
    })
    return query
}

export const Sdks = () => {
    const [copied, setCopied] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const { sdks: prefetchedSdks } = useLoaderData() as { sdks: SDK[] }
    const { instanceKey, workspaceKey, projectKey, environmentKey } = useFlagbaseParams()

    const convertSdksToList = (sdks: SDK[]) => {
        return sdks.map((sdk) => {
            return {
                clientKey: (
                    <div className="flex">
                        <div>{sdk.attributes.clientKey}</div>
                        <DocumentDuplicateIcon
                            className="w-5 h-5 text-indigo-600 cursor-pointer"
                            onClick={() => {
                                navigator.clipboard.writeText(sdk.attributes.clientKey)
                                setCopied(true)
                            }}
                        />
                    </div>
                ),
                serverKey: (
                    <div className="flex">
                        <div>{sdk.attributes.serverKey}</div>
                        <DocumentDuplicateIcon
                            className="w-5 h-5 text-indigo-600 cursor-pointer"
                            onClick={() => {
                                navigator.clipboard.writeText(sdk.attributes.serverKey)
                                setCopied(true)
                            }}
                        />
                    </div>
                ),
                name: sdk.attributes.name,
                description: sdk.attributes.description,
                tags: sdk.attributes.tags.map((tag) => <Tag key={tag}>{tag}</Tag>),
                action: (
                    <Link
                        to={`/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/environments/${environmentKey}/sdk-keys/${sdk.id}`}
                    >
                        <Button className="py-2">Edit</Button>
                    </Link>
                ),
            }
        })
    }

    return (
        <Suspense fallback={<Loader />}>
            <Await resolve={prefetchedSdks}>
                {(sdks: SDK[]) => (
                    <div className="mt-5">
                        <AddNewSDKModal visible={showModal} setVisible={setShowModal} />
                        <Notification
                            type="success"
                            title="Copied!"
                            content="Copied to clipboard"
                            show={copied}
                            setShow={setCopied}
                        />

                        <Table
                            loading={false}
                            dataSource={convertSdksToList(sdks)}
                            columns={sdkColumns}
                            emptyState={
                                <EmptyState
                                    title="No SDKs found"
                                    description="This environment does not have any SDKs yet."
                                    cta={
                                        <Button className="py-2" suffix={PlusCircleIcon}>
                                            Create Sdk
                                        </Button>
                                    }
                                />
                            }
                        />
                        {sdks.length === 0 && (
                            <EmptyState
                                title="There are no SDKs yet"
                                description="Oh no"
                                cta={
                                    <Button onClick={() => setShowModal(true)} className="py-2">
                                        Create SDK
                                    </Button>
                                }
                            />
                        )}
                    </div>
                )}
            </Await>
        </Suspense>
    )
}
