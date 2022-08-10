import React, { useContext } from 'react'

import { PageContainer } from './page-layout.styles'
import { Menu } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { InstanceContext } from '../../app/context/instance'
import { ProjectContext } from '../../app/context/project'
import { WorkspaceContext } from '../../app/context/workspace'
import { convertProjects } from '../../app/pages/projects/projects'
import { convertWorkspaces } from '../../app/pages/workspaces/workspaces.helpers'
import { BlockOutlined, ClusterOutlined, ApartmentOutlined } from '@ant-design/icons'
import flag from '../../assets/flagbaseLogo.svg'
import styled from '@emotion/styled'

const { SubMenu } = Menu

type Props = {
    navigation: React.ReactNode
}

const MenuItem = styled(Menu.Item)`
    font-weight: 600;
`

const PageLayout: React.FC<Props> = ({ children, navigation }) => {
    const { selectedEntityId, getEntity } = useContext(InstanceContext)
    const { entities: workspaces } = useContext(WorkspaceContext)
    const { entities: projects } = useContext(ProjectContext)
    const navigate = useNavigate()

    const instance = selectedEntityId ? getEntity(selectedEntityId) : null
    const workspaceMenu = instance ? (
        Object.keys(workspaces).length == 0 ? (
            <MenuItem key="workspaces" icon={<ClusterOutlined />}>
                <Link to={`/workspaces/${selectedEntityId}`}>Workspaces</Link>
            </MenuItem>
        ) : (
            <SubMenu
                onTitleClick={() => navigate(`/workspaces/${selectedEntityId}`)}
                key="workspaces"
                title="Workspaces"
                icon={<ClusterOutlined />}
            >
                {convertWorkspaces(workspaces, instance, '').map((workspace) => (
                    <Menu.Item key={workspace.id}>
                        <Link to={workspace.href}>{workspace.title}</Link>
                    </Menu.Item>
                ))}
            </SubMenu>
        )
    ) : undefined

    const projectMenu = instance ? (
        Object.keys(projects).length == 0 ? (
            <MenuItem key="projects" icon={<ApartmentOutlined />}>
                <Link to={`/workspaces/${selectedEntityId}`}>Projects</Link>
            </MenuItem>
        ) : (
            <SubMenu key="projects" title="Projects" icon={<ApartmentOutlined />}>
                {convertProjects(projects, instance, '').map((project) => (
                    <MenuItem>
                        <Link to={project.href}>{project.title}</Link>
                    </MenuItem>
                ))}
            </SubMenu>
        )
    ) : undefined

    return (
        <>
            <Menu mode="horizontal">
                <SubMenu key="logo" title={<img width={30} src={flag} />}>
                    <Menu.ItemGroup title="Instances">
                        <Menu.Item key="setting:1" icon={<BlockOutlined />}>
                            <Link to="/">Switch Instance</Link>
                        </Menu.Item>
                    </Menu.ItemGroup>
                </SubMenu>
                {workspaceMenu}
                {projectMenu}
            </Menu>

            <PageContainer>{children}</PageContainer>
        </>
    )
}

export default PageLayout
