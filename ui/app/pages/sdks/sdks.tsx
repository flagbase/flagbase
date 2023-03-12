import React, { Suspense, useState } from 'react'
import { useQuery } from 'react-query'
import { Await, useLoaderData } from 'react-router-dom'
import Button from '../../../components/button'
import EmptyState from '../../../components/empty-state'
import { StackedEntityList, StackedEntityListProps } from '../../../components/list/stacked-list'
import Tag from '../../../components/tag'
import { configureAxios } from '../../lib/axios'
import { FlagbaseParams, useFlagbaseParams } from '../../lib/use-flagbase-params'
import { getSdkKey } from '../../router/loaders'
import { fetchSdkList, SDK } from './api'
import { AddNewSDKModal } from './sdks.modal'

export const useSDKs = ({ instanceKey, workspaceKey, projectKey, environmentKey }: FlagbaseParams) => {
    const queryKey = getSdkKey({ instanceKey, workspaceKey, projectKey, environmentKey })
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
    const [showModal, setShowModal] = useState(false)
    const { sdks: prefetchedSdks } = useLoaderData() as { sdks: SDK[] }
    const { instanceKey, workspaceKey, projectKey, environmentKey } = useFlagbaseParams()
    const convertSdksToList: StackedEntityListProps = (sdks: SDK[]) => {
        return sdks.map((sdk) => {
            return {
                id: sdk.id,
                title: sdk.attributes.name,
                href: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/environments/${environmentKey}/sdk-keys/${sdk.id}`,
                name: sdk.attributes.name,
                description: sdk.attributes.description,
                tags: sdk.attributes.tags.map((tag) => <Tag key={tag}>{tag}</Tag>),
                action: (
                    <div>
                        <Button secondary className="py-2">
                            Connect
                        </Button>
                    </div>
                ),
                key: sdk.attributes.clientKey,
            }
        })
    }

    const { data: sdks } = useSDKs({ instanceKey, workspaceKey, projectKey, environmentKey })
    console.log('received', sdks)

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Await resolve={prefetchedSdks}>
                {(sdks: SDK[]) => (
                    <div className="mt-5">
                        <AddNewSDKModal visible={showModal} setVisible={setShowModal} />

                        <StackedEntityList entities={convertSdksToList(sdks)} />
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
