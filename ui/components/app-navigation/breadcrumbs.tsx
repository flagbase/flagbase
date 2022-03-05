/* eslint-disable no-return-assign */
/** @jsx jsx */

import React, { useContext, useState } from 'react'
import { Breadcrumb, Menu } from 'antd'

import { jsx } from '@emotion/react'
import { Link } from 'react-router-dom'
import { InstanceContext } from '../../app/context/instance'
import { WorkspaceContext } from '../../app/context/workspace'
import { ProjectContext } from '../../app/context/project'
import { convertProjects } from '../../app/pages/projects/projects'
import { convertWorkspaces } from '../../app/pages/workspaces/workspaces.helpers'

const Breadcrumbs: React.FC = ({}) => {
    const { selectedEntityId, getEntity } = useContext(InstanceContext)
    const { entities: workspaces, status: workspaceStatus } = useContext(WorkspaceContext)

    const { entities: projects, status: projectStatus } = useContext(ProjectContext)

    const instance = selectedEntityId ? getEntity(selectedEntityId) : null
    console.log('Workspaces', workspaces)
    const workspaceMenu =
        Object.keys(workspaces).length > 0 && instance ? (
            <Menu>
                {convertWorkspaces(workspaces, instance, '').map((workspace) => (
                    <Menu.Item>
                        <Link to={workspace.href}>{workspace.title}</Link>
                    </Menu.Item>
                ))}
            </Menu>
        ) : undefined

    const projectMenu =
        Object.keys(projects).length > 0 && instance ? (
            <Menu>
                {convertProjects(projects, instance, '').map((project) => (
                    <Menu.Item>
                        <Link to={project.href}>{project.title}</Link>
                    </Menu.Item>
                ))}
            </Menu>
        ) : undefined

    return (
        <Breadcrumb>
            <Breadcrumb.Item>Flagbase</Breadcrumb.Item>
            <Breadcrumb.Item>
                <Link to="/">Instances</Link>
            </Breadcrumb.Item>
            {selectedEntityId && (
                <Breadcrumb.Item overlay={workspaceMenu}>
                    <Link to={`/workspaces/${selectedEntityId}`}>Workspaces</Link>
                </Breadcrumb.Item>
            )}
            {projectStatus === 'loaded' && (
                <Breadcrumb.Item overlay={projectMenu}>
                    <Link to="/">Projects</Link>
                </Breadcrumb.Item>
            )}
        </Breadcrumb>
    )
}

export default Breadcrumbs
