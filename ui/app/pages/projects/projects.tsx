import { Alert, Col, Dropdown, Menu, Row, Typography } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Attributes, Project } from '../../context/project'
import Table from '../../../components/table/table'
import { createProject, fetchProjects } from './api'
import { Instance } from '../../context/instance'
import { Layout, Content } from '../../../components/layout'
import Button from '../../../components/button'
import { CreateProject } from './projects.modal'
import { Link } from 'react-router-dom'
import { constants, projectsColumn } from './projects.constants'
import { useInstances } from '../instances/instances'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useWorkspaces } from '../workspaces/workspaces.main'
import { Workspace } from '../workspaces/api'
import { axios } from '../../lib/axios'
import { PlusCircleIcon, PlusIcon } from '@heroicons/react/24/outline'
import Input from '../../../components/input'
import EmptyState from '../../../components/empty-state'

const { Text } = Typography

export const convertProjects = (projectList: Project[], instanceKey: string, filter: string = '') => {
    if (!projectList) {
        return []
    }

    return Object.values(projectList)
        .filter((project): project is Project => project !== undefined && project.attributes.key.includes(filter))
        .map((project: Project, index: number) => {
            return {
                id: index,
                title: project.attributes.name,
                href: `/flags/${instanceKey}/${project?.id}`,
                name: <Text>{project.attributes.name}</Text>,
                description: <Text>{project.attributes.description}</Text>,
                tags: project.attributes.tags?.join(', '),
                action: <Link to={`/flags/${instanceKey}/${project?.id}`}>Connect</Link>,
                key: project.attributes.key,
            }
        })
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

export const useProjects = (instanceKey: string, workspaceKey: string, options?: any) => {
    const { data: instances } = useInstances({
        select: (instances: Instance[]) =>
            instances.filter((i) => i?.key?.toLocaleLowerCase() === instanceKey?.toLocaleLowerCase()),
    })
    const [instance] = instances || []

    const { data: workspace } = useWorkspaces(instance?.key, {
        select: (workspaces: Workspace[]) => {
            const [filtered] = workspaces.filter(
                (workspace) => workspace?.attributes?.key.toLocaleLowerCase() === workspaceKey?.toLocaleLowerCase()
            )
            return filtered
        },
    })

    const query = useQuery<Project[]>(['projects', instance?.key, workspace?.attributes?.key], {
        ...options,
        queryFn: () => fetchProjects(workspaceKey),
        onSuccess: () => {
            axios.defaults.baseURL = instance.connectionString
            axios.defaults.headers.common['Authorization'] = `Bearer ${instance.accessToken}`
        },
        enabled: !!instance?.key && !!workspace?.attributes?.key,
    })
    return query
}

const Projects: React.FC = () => {
    const { workspaceKey, instanceKey } = useParams<{ workspaceKey: string; instanceKey: string }>()
    if (!workspaceKey || !instanceKey) {
        return <Alert message="Could not load this instance" type="error" />
    }

    const [visible, setVisible] = useState(false)
    const [filter, setFilter] = useState('')

    const { data: projects, status } = useProjects(instanceKey, workspaceKey)

    return (
        <div className="mt-5">
            <CreateProject visible={visible} setVisible={setVisible} />

            <div className="flex flex-col-reverse md:flex-row gap-3 items-stretch pb-5">
                <Button onClick={() => setVisible(true)} type="button" suffix={PlusCircleIcon}>
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
            {projects && (
                <Table
                    loading={status !== 'success'}
                    dataSource={convertProjects(projects, instanceKey, filter)}
                    columns={projectsColumn}
                    emptyState={
                        <EmptyState
                            title="No Projects"
                            description={'Get started by creating a new project.'}
                            cta={
                                <Button className="py-2" suffix={PlusCircleIcon} onClick={() => setVisible(true)}>
                                    Create Project
                                </Button>
                            }
                        />
                    }
                />
            )}
        </div>
    )
}

export default Projects
