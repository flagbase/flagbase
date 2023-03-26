import React, { Suspense } from 'react'
import { Await, Link, useLoaderData } from 'react-router-dom'
import Table from '../../../components/table/table'
import Button from '../../../components/button'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import EmptyState from '../../../components/empty-state'
import { Loader } from '../../../components/loader'
import Tag from '../../../components/tag'
import { useFlagbaseParams } from '../../lib/use-flagbase-params'
import { getVariationsKey } from '../../router/loaders'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { configureAxios } from '../../lib/axios'
import { createVariation, fetchVariations, VariationCreateBody } from './api'
import { getVariationPath } from '../../router/router'

export const variationColumns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Key',
        dataIndex: 'key',
        key: 'key',
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

export type Variation = {
    type: 'variation'
    id: string
    attributes: {
        description: string
        key: string
        name: string
        tags: string[]
    }
}

const convertVariationsToTable = ({
    variations,
    params,
}: {
    variations: Variation[]
    params: {
        instanceKey: string
        workspaceKey: string
        projectKey: string
        flagKey: string
    }
}) => {
    const { instanceKey, workspaceKey, projectKey, flagKey } = params || {}
    if (!instanceKey || !workspaceKey || !projectKey || !flagKey) {
        return []
    }
    return variations.map((variation) => {
        return {
            key: variation.attributes.key,
            name: variation.attributes.name,
            description: variation.attributes.description,
            tags: variation.attributes.tags.map((tag) => <Tag key={tag}>{tag}</Tag>),
            action: (
                <Link
                    to={getVariationPath({
                        instanceKey,
                        workspaceKey,
                        projectKey,
                        flagKey,
                        variationKey: variation.attributes.key,
                    })}
                >
                    <Button secondary className="py-2">
                        Modify
                    </Button>
                </Link>
            ),
        }
    })
}

export const useAddVariation = () => {
    const queryClient = useQueryClient()
    const { instanceKey, workspaceKey, projectKey, flagKey } = useFlagbaseParams()
    const mutation = useMutation({
        mutationFn: async (values: VariationCreateBody) => {
            await createVariation({
                workspaceKey: workspaceKey!,
                projectKey: projectKey!,
                flagKey: flagKey!,
                variation: values,
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getVariationsKey({
                    instanceKey: instanceKey!,
                    workspaceKey: workspaceKey!,
                    projectKey: projectKey!,
                    flagKey: flagKey!,
                }),
            })
        },
    })
    return mutation
}

export const useVariations = () => {
    const { instanceKey, workspaceKey, projectKey, flagKey } = useFlagbaseParams()

    const query = useQuery<Variation[]>(
        getVariationsKey({
            instanceKey: instanceKey!,
            workspaceKey: workspaceKey!,
            projectKey: projectKey!,
            flagKey: flagKey!,
        }),
        {
            queryFn: async () => {
                await configureAxios(instanceKey!)
                return fetchVariations({ workspaceKey: workspaceKey!, projectKey: projectKey!, flagKey: flagKey! })
            },
            enabled: !!workspaceKey && !!projectKey && !!flagKey,
            refetchOnWindowFocus: false,
        }
    )
    return query
}

const Variations = () => {
    const { variations: prefetchedVariations } = useLoaderData() as { variations: Variation[] }
    const { data: variations } = useVariations() as { data: Variation[] }
    const params = useFlagbaseParams()
    return (
        <Suspense fallback={<Loader />}>
            <Await resolve={prefetchedVariations}>
                {() => (
                    <React.Fragment>
                        <Table
                            loading={false}
                            dataSource={convertVariationsToTable({ variations, params })}
                            columns={variationColumns}
                            emptyState={
                                <EmptyState
                                    title="No variations found"
                                    description="This flag does not have any variations yet."
                                    cta={
                                        <Button className="py-2" suffix={PlusCircleIcon}>
                                            Create Variation
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

export default Variations
