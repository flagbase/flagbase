import { Typography } from 'antd'
import React, { Suspense, useState } from 'react'
import { Await, useLoaderData } from 'react-router-dom'
import Table from '../../../components/table/table'
import { createProject, deleteProject, fetchProjects, Project } from './api'
import Button from '../../../components/button'
import { CreateProject } from './projects.modal'
import { Link } from 'react-router-dom'
import { constants, projectsColumn } from './projects.constants'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Workspace } from '../workspaces/api'
import { configureAxios } from '../../lib/axios'
import { MagnifyingGlassIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import EmptyState from '../../../components/empty-state'
import { RawInput } from '../../../components/input/input'
import Tag from '../../../components/tag'
import { Loader } from '../../../components/loader'
import { useFlagbaseParams } from '../../lib/use-flagbase-params'

const { Text } = Typography

export const convertProjects = ({
    projects,
    instanceKey,
    workspaceKey,
    filter = '',
}: {
    projects: Project[]
    instanceKey: string
    workspaceKey: string
    filter: string
}) => {
    if (!projects) {
        return []
    }

    return Object.values(projects)
        .filter((project): project is Project => project !== undefined && project.attributes.key.includes(filter))
        .map((project: Project, index: number) => {
            return {
                id: index,
                title: project.attributes.name,
                href: `/flags/${instanceKey}/${project?.id}`,
                name: <Text>{project.attributes.name}</Text>,
                description: <Text>{project.attributes.description}</Text>,
                tags: (
                    <div>
                        {project.attributes.tags.map((tag) => (
                            <Tag key={tag} className="mr-2">
                                {tag}
                            </Tag>
                        ))}
                    </div>
                ),
                action: (
                    <Link to={`/${instanceKey}/workspaces/${workspaceKey}/projects/${project.attributes.key}/flags`}>
                        <Button secondary className="py-2">
                            Connect
                        </Button>
                    </Link>
                ),
                key: project.attributes.key,
            }
        })
}

export const useRemoveProject = (instanceKey: string, workspaceKey: string) => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (projectKey: string) => {
            await deleteProject(projectKey)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects', instanceKey, workspaceKey] })
        },
    })
    return mutation
}

export const useAddProject = (instanceKey: string, workspaceKey: string) => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (values: Omit<Workspace['attributes'], 'key'>) => {
            await createProject(values.name, values.description, values.tags, workspaceKey)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects', instanceKey, workspaceKey] })
        },
    })
    return mutation
}

export const useProjects = (instanceKey: string | undefined, workspaceKey: string | undefined, options?: any) => {
    const query = useQuery<Project[]>(['projects', instanceKey, workspaceKey], {
        ...options,
        queryFn: async () => {
            await configureAxios(instanceKey!)
            return fetchProjects(workspaceKey!)
        },
        enabled: !!instanceKey && !!workspaceKey,
        refetchOnWindowFocus: false,
    })
    return query
}

const Projects = () => {
    const [visible, setVisible] = useState(false)
    const [filter, setFilter] = useState('')
    const { projects: prefetchedProjects } = useLoaderData() as { projects: Project[] }
    const { instanceKey, workspaceKey } = useFlagbaseParams()

    const { data: projects } = useProjects(instanceKey, workspaceKey)

    return (
        <Suspense fallback={<Loader />}>
            <Await resolve={prefetchedProjects} errorElement={<p>Error loading package location!</p>}>
                <div className="mt-5">
                    <CreateProject visible={visible} setVisible={setVisible} />

                    <div className="flex flex-col-reverse md:flex-row gap-3 items-stretch pb-5">
                        <Button onClick={() => setVisible(true)} type="button" suffix={PlusCircleIcon}>
                            {constants.create}
                        </Button>
                        <div className="flex-auto">
                            <RawInput
                                onChange={(event) => setFilter(event.target.value)}
                                placeholder="Search"
                                prefix={MagnifyingGlassIcon as any}
                            />
                        </div>
                    </div>

                    <Table
                        loading={false}
                        dataSource={convertProjects({ projects, workspaceKey, instanceKey, filter })}
                        columns={projectsColumn}
                        emptyState={
                            <EmptyState
                                title="No Projects"
                                description={'Get started by creating a new project.'}
                                cta={
                                    <Button className="py-2" suffix={PlusCircleIcon} onClick={() => setVisible(true)}>
                                        {constants.create}
                                    </Button>
                                }
                            />
                        }
                    />
                </div>
            </Await>
        </Suspense>
    )
}

export default Projects
