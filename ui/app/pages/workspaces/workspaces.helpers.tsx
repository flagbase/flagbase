import { Typography } from 'antd'
import React from 'react'
import { Instance } from '../../context/instance'
import { Workspace } from '../../context/workspace'
import { Entities, Entity } from '../../lib/entity-store/entity-store'
import { Link } from 'react-router-dom'

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
    workspaceList: Entities<Workspace>,
    instance: Instance,
    filter: string,
    addEntity?: (entity: Entity<Workspace>) => void
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
            const updateWorkspace = (updatedWorkspace: Partial<Entity<Workspace>>) => {
                if (addEntity) {
                    const mergedEntity = { ...updatedWorkspace, ...currentWorkspace }
                    addEntity(mergedEntity)
                }
            }
            return {
                id: index,
                title: <Text>{currentWorkspace.attributes.name}</Text>,
                href: `/projects/${instance?.id}/${currentWorkspace?.attributes.key}`,
                name: (
                    <Link to={`/projects/${instance?.id}/${currentWorkspace?.attributes.key}`}>
                        <Text
                            strong
                            editable={{
                                onChange: (value) =>
                                    updateWorkspace({ attributes: { ...currentWorkspace.attributes, name: value } }),
                            }}
                        >
                            {currentWorkspace.attributes.name}
                        </Text>
                    </Link>
                ),
                description: (
                    <Text
                        editable={{
                            onChange: (value) =>
                                updateWorkspace({ attributes: { ...currentWorkspace.attributes, description: value } }),
                        }}
                    >
                        {currentWorkspace.attributes.description}
                    </Text>
                ),
                tags: currentWorkspace.attributes.tags.join(', '),
            }
        })
}
