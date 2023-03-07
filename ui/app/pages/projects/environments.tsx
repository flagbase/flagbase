import React, { Suspense } from 'react'
import { useQuery } from 'react-query'
import { Await, useLoaderData } from 'react-router-dom'
import Button from '../../../components/button'
import { Divider } from '../../../components/divider'
import { StackedEntityList, StackedEntityListProps } from '../../../components/list/stacked-list'
import { Heading } from '../../../components/text/heading'
import { configureAxios } from '../../lib/axios'
import { useFlagbaseParams } from '../../lib/use-flagbase-params'
import { fetchEnvironments } from './api'

type Environment = {
    type: string
    id: string
    attributes: {
        description: string
        key: string
        name: string
        tags: string[]
    }
}

export const useEnvironments = (
    instanceKey: string | undefined,
    workspaceKey: string | undefined,
    projectKey: string | undefined,
    options?: any
) => {
    const query = useQuery<Environment[]>(['environments', instanceKey, workspaceKey, projectKey], {
        ...options,
        queryFn: async () => {
            await configureAxios(instanceKey!)
            return fetchEnvironments(workspaceKey!, projectKey!)
        },
        enabled: !!instanceKey && !!workspaceKey,
    })
    return query
}

const Environments = () => {
    const { environments: prefetchedEnvironments } = useLoaderData() as Environment
    const { instanceKey, workspaceKey, projectKey } = useFlagbaseParams()
    const convertEnvironmentsToList: StackedEntityListProps = (environments: Environment[]) => {
        console.log('converting', environments)
        return environments.map((environment) => {
            return {
                id: environment.id,
                title: environment.attributes.name,
                href: `/environments/${instanceKey}/${workspaceKey}/${projectKey}/${environment.attributes.key}`,
                name: environment.attributes.name,
                description: environment.attributes.description,
                tags: environment.attributes.tags,
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
    console.log('received', environments)

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Await resolve={prefetchedEnvironments}>
                {(environments: Environment) => (
                    <main className="mx-auto max-w-lg px-4 pt-10 pb-12 lg:pb-16">
                        <div>
                            <Heading className="mb-4" text="Environments" />
                            <Divider />
                            <StackedEntityList entities={convertEnvironmentsToList(environments)} />
                        </div>
                    </main>
                )}
            </Await>
        </Suspense>
    )
}

export default Environments
