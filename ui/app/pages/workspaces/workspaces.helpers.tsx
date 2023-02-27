import { Typography } from 'antd'
import React from 'react'
import { Instance } from '../../context/instance'
import { Entity } from '../../lib/entity-store/entity-store'
import { Link } from 'react-router-dom'
import { Workspace } from './api'

interface ConvertedWorkspace {
    id: number
    title: JSX.Element
    href: string
    name: JSX.Element
    description: JSX.Element
    tags: string
}

const { Text } = Typography

export const convertWorkspaces = (
    workspaceList: Workspace[],
    instance: Instance,
    filter: string
): ConvertedWorkspace[] => {
    if (!workspaceList) {
        return []
    }

    return Object.values(workspaceList)
        .filter(
            (workspace): workspace is Entity<Workspace> =>
                workspace !== undefined && workspace.attributes.name.includes(filter)
        )
        .map((currentWorkspace, index) => {
            return {
                id: index,
                title: <Text>{currentWorkspace.attributes.name}</Text>,
                href: `/${instance.key}/workspaces/${currentWorkspace?.attributes.key}/projects`,
                name: (
                    <Link to={`/${instance.key}/workspaces/${currentWorkspace?.attributes.key}/projects`}>
                        <Text strong>{currentWorkspace.attributes.name}</Text>
                    </Link>
                ),
                description: <Text>{currentWorkspace.attributes.description}</Text>,
                tags: currentWorkspace.attributes.tags.join(', '),
                key: currentWorkspace.attributes.key,
            }
        })
}
