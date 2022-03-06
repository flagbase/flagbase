import React, { useContext } from 'react'

import { PageContainer } from './page-layout.styles'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import { InstanceContext } from '../../app/context/instance'
import { ProjectContext } from '../../app/context/project'
import { WorkspaceContext } from '../../app/context/workspace'
import { convertProjects } from '../../app/pages/projects/projects'
import { convertWorkspaces } from '../../app/pages/workspaces/workspaces.helpers'
import { BlockOutlined, ClusterOutlined, ApartmentOutlined } from '@ant-design/icons'
import flag from '../../assets/flagbaseLogo.svg'

console.log('FLAG', flag)
const { SubMenu } = Menu

type Props = {
    navigation: React.ReactNode
}

const PageLayout: React.FC<Props> = ({ children, navigation }) => {
    const { selectedEntityId, getEntity } = useContext(InstanceContext)
    const { entities: workspaces } = useContext(WorkspaceContext)
    const { entities: projects, status: projectStatus } = useContext(ProjectContext)

    const instance = selectedEntityId ? getEntity(selectedEntityId) : null
    console.log('Workspaces', workspaces)
    const workspaceMenu = instance ? (
        Object.keys(workspaces).length == 0 ? (
            <Menu.Item key="workspaces" icon={<ClusterOutlined />}>
                <Link to={`/workspaces/${selectedEntityId}`}>Workspaces</Link>
            </Menu.Item>
        ) : (
            <SubMenu key="workspaces" title="Workspaces" icon={<ClusterOutlined />}>
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
            <Menu.Item key="projects" icon={<ApartmentOutlined />}>
                <Link to={`/workspaces/${selectedEntityId}`}>Projects</Link>
            </Menu.Item>
        ) : (
            <SubMenu key="projects" title="Projects" icon={<ApartmentOutlined />}>
                {convertProjects(projects, instance, '').map((project) => (
                    <Menu.Item>
                        <Link to={project.href}>{project.title}</Link>
                    </Menu.Item>
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
            {/* <Tabs /> */}
            <PageContainer>{children}</PageContainer>
        </>
    )
}

export default PageLayout
