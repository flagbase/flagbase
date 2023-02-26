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
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import {
    ArrowPathIcon,
    Bars3Icon,
    ChartPieIcon,
    CursorArrowRaysIcon,
    FingerPrintIcon,
    SquaresPlusIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'

const { SubMenu } = Menu

type Props = {
    navigation: React.ReactNode
}

const MenuItem = styled(Menu.Item)`
    font-weight: 600;
`

const navigation = [
    { name: 'Analytics', description: 'Get a better understanding of your traffic', href: '#', icon: ChartPieIcon },
    { name: 'Engagement', description: 'Speak directly to your customers', href: '#', icon: CursorArrowRaysIcon },
    { name: 'Security', description: 'Your customers’ data will be safe and secure', href: '#', icon: FingerPrintIcon },
    { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: SquaresPlusIcon },
    { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: ArrowPathIcon },
]

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="bg-white">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex items-center gap-x-12">
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <img className="h-8 w-auto" src={flag} alt="" />
                    </a>
                    <div className="hidden lg:flex lg:gap-x-12">
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-sm font-semibold leading-6 text-gray-900"
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <div className="hidden lg:flex">
                    <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                        Log in <span aria-hidden="true">&rarr;</span>
                    </a>
                </div>
            </nav>
            <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <div className="fixed inset-0 z-10" />
                <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img
                                className="h-8 w-auto"
                                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                alt=""
                            />
                        </a>
                        <button
                            type="button"
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                            <div className="py-6">
                                <a
                                    href="#"
                                    className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    Log in
                                </a>
                            </div>
                        </div>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </header>
    )
}

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
            <Header />

            <PageContainer>{children}</PageContainer>
        </>
    )
}

export default PageLayout
