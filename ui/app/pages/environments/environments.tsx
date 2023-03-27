import React, { Suspense } from 'react'
import { useQuery } from 'react-query'
import { Await, useLoaderData } from 'react-router-dom'
import Button from '../../../components/button'
import { StackedEntityList, StackedEntityListProps } from '../../../components/list/stacked-list'
import { Loader } from '../../../components/loader'
import Tag from '../../../components/tag'
import { configureAxios } from '../../lib/axios'
import { useFlagbaseParams } from '../../lib/use-flagbase-params'
import { fetchEnvironments } from './api'

export type Environment = {
    type: string
    id: string
    attributes: {
        description: string
        key: string
        name: string
        tags: string[]
    }
}

export const getEnvironmentKey = ({
    instanceKey,
    workspaceKey,
    projectKey,
}: {
    instanceKey: string
    workspaceKey: string
    projectKey: string
}) => {
    return ['environments', instanceKey, workspaceKey, projectKey]
}
export const useEnvironments = () => {
    const { instanceKey, workspaceKey, projectKey } = useFlagbaseParams()
    const query = useQuery<Environment[]>(
        getEnvironmentKey({
            instanceKey: instanceKey!,
            workspaceKey: workspaceKey!,
            projectKey: projectKey!,
        }),
        {
            queryFn: async () => {
                await configureAxios(instanceKey!)
                return fetchEnvironments(workspaceKey!, projectKey!)
            },
            enabled: !!instanceKey && !!workspaceKey,
        }
    )
    return query
}

const Environments = () => {
    const { environments: prefetchedEnvironments } = useLoaderData() as { environments: Environment[] }
    const { instanceKey, workspaceKey, projectKey } = useFlagbaseParams()
    const convertEnvironmentsToList: StackedEntityListProps = (environments: Environment[]) => {
        return environments.map((environment) => {
            return {
                id: environment.id,
                title: environment.attributes.name,
                href: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/environments/${environment.attributes.key}/sdk-keys`,
                name: environment.attributes.name,
                description: environment.attributes.description,
                tags: environment.attributes.tags.map((tag) => <Tag key={tag}>{tag}</Tag>),
                action: (
                    <div>
                        <Button secondary className="py-2">
                            Connect
                        </Button>
                    </div>
                ),
                key: environment.attributes.key,
            }
        })
    }

    const { data: environments } = useEnvironments(instanceKey, workspaceKey, projectKey)

    return (
        <Suspense fallback={<Loader />}>
            <Await resolve={prefetchedEnvironments}>
                {(environments: Environment) => (
                    <div className="mt-5">
                        <StackedEntityList entities={convertEnvironmentsToList(environments)} />
                    </div>
                )}
            </Await>
        </Suspense>
    )
}

export default Environments