import React, { Fragment, useEffect } from 'react'

import { Link, Outlet, useLocation, useParams } from 'react-router-dom'
import flag from '../../assets/flagbaseLogo.svg'
import { useState } from 'react'
import { Disclosure, Transition, Popover, Dialog } from '@headlessui/react'
import {
    ArrowLeftCircleIcon,
    Bars3Icon,
    ChevronDownIcon,
    ChevronRightIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { useInstances } from '../../app/pages/instances/instances'
import { getEnvironmentPath, getWorkspacePath, getWorkspacesPath } from '../../app/router/router'
import { useWorkspaces } from '../../app/pages/workspaces/workspaces.main'
import { Workspace } from '../../app/pages/workspaces/api'
import { useProjects } from '../../app/pages/projects/projects'
import { useFlagbaseParams } from '../../app/lib/use-flagbase-params'
import { Environment, useEnvironments } from '../../app/pages/projects/environments'
import { Project } from '../../app/pages/projects/api'
import { Instance } from '../../app/pages/instances/instances.functions'

const instancesDescription = `An "instance" refers to a Flagbase core installation, running on a single VPS or clustered in a datacenter.`
const workspaceDescription = `A workspace is the top-level resource which is used to group projects.`
const projectsDescription = `A project is a collection of feature flags and settings. You can have multiple projects in a single workspace.`
const environmentsDescription = `An environment is a set of feature flags and settings that can be applied to a specific set of users.`
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const MobileDropdown = ({
    name,
    children,
}: {
    name: string
    description: string
    href: string
    children: {
        name: string
        description: string
        href: string
    }[]
}) => {
    return (
        <Disclosure as="div" className="-mx-3">
            {({ open }) => (
                <>
                    <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 hover:bg-gray-50">
                        {name}
                        <ChevronDownIcon
                            className={classNames(open ? 'rotate-180' : '', 'h-5 w-5 flex-none')}
                            aria-hidden="true"
                        />
                    </Disclosure.Button>
                    <Disclosure.Panel className="mt-2 space-y-2">
                        {children.map((item) => (
                            <Disclosure.Button
                                key={item.name}
                                as="a"
                                href={item.href}
                                className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            >
                                {item.name}
                            </Disclosure.Button>
                        ))}
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}

const Breadcrumb = ({
    name,
    description,
    type,
    href,
    children,
    chevron = true,
}: {
    name: string
    description: string
    type: string
    href: string
    chevron?: boolean
    children: {
        name: string
        description: string
        href: string
    }[]
}) => {
    return (
        <Popover className="relative">
            <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 ">
                <li key={name}>
                    <div className="flex items-center">
                        {chevron && (
                            <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        )}
                        <a
                            href="#"
                            className={`${chevron && 'ml-4'} text-sm font-medium text-gray-500 hover:text-gray-700`}
                        >
                            {name}
                        </a>
                    </div>
                </li>{' '}
            </Popover.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
            >
                <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                    <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                        <Link to={href} className="flex items-center gap-1 mb-2">
                            <ArrowLeftCircleIcon
                                className="h-5 w-5 flex-none text-indigo-600 hover:text-indigo-800"
                                aria-hidden="true"
                            />
                            <h3 className="text-base font-semibold leading-6 text-indigo-600 hover:text-indigo-800">
                                {type}
                            </h3>
                        </Link>
                        <p className="mt-1 text-sm text-gray-500">{description}</p>
                    </div>
                    <div className="p-4">
                        {children.map((child) => (
                            <div
                                key={child.name}
                                className="group relative flex gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                            >
                                <div className="flex-auto">
                                    <Link to={child.href} className="block font-semibold text-gray-900">
                                        {child.name}
                                        <span className="absolute inset-0" />
                                    </Link>
                                    <p className="mt-1 text-gray-600">{child.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    )
}

const getEnvironmentDropdown = (data: Environment[], instanceKey: string, workspaceKey: string, projectKey: string) => {
    return data.map((object) => {
        return {
            name: object.attributes.name,
            description: object.attributes.description,
            href: getEnvironmentPath(instanceKey, workspaceKey, projectKey, object.attributes.key),
        }
    })
}

const getProjectDropdown = (data: Project[]) => {
    return data.map((object) => {
        return {
            name: object.attributes.name,
            description: object.attributes.description,
            href: getWorkspacesPath(object.attributes.key),
        }
    })
}

const getWorkspaceDropdown = (data: Workspace[], instanceKey: string) => {
    return data.map((object) => {
        return {
            name: object.attributes.name,
            description: object.attributes.description,
            href: getWorkspacePath(instanceKey, object.attributes.key),
        }
    })
}
const getInstanceDropdown = (data: Instance[]) => {
    return (
        data.map((object) => {
            return {
                name: object.key,
                description: object.key,
                href: getWorkspacesPath(object.key),
            }
        }) || []
    )
}

const MobileNavigation = ({
    mobileMenuOpen,
    setMobileMenuOpen,
    instances,
    workspaces,
    projects,
}: {
    mobileMenuOpen: boolean
    setMobileMenuOpen: any
    instances?: Instance[]
    workspaces?: Workspace[]
    projects?: Project[]
}) => {
    const { instanceKey } = useParams<{ instanceKey: string; workspaceKey: string; projectsKey: string }>()

    return (
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
            <div className="fixed inset-0 z-10" />
            <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                <div className="flex items-center justify-between">
                    <Link to="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Flagbase</span>
                        <img className="h-5 w-auto" src={flag} alt="" />
                    </Link>
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
                            {instances && (
                                <MobileDropdown
                                    name="Instances"
                                    description={instancesDescription}
                                    href="/instances"
                                    children={getInstanceDropdown(instances)}
                                />
                            )}
                            {workspaces && (
                                <MobileDropdown
                                    name="Workspaces"
                                    description={workspaceDescription}
                                    href="/"
                                    children={getWorkspaceDropdown(workspaces, instanceKey)}
                                />
                            )}
                            {projects && (
                                <MobileDropdown
                                    name="Workspaces"
                                    description={workspaceDescription}
                                    href="/"
                                    children={getProjectDropdown(projects)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </Dialog.Panel>
        </Dialog>
    )
}

const Header = () => {
    const { instanceKey, workspaceKey, projectKey } = useFlagbaseParams()

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { data: instances } = useInstances()
    const { data: workspaces } = useWorkspaces(instanceKey)
    const { data: projects } = useProjects(instanceKey, workspaceKey)
    const { data: environments } = useEnvironments({
        instanceKey: instanceKey!,
        workspaceKey: workspaceKey!,
        projectKey: projectKey!,
    })

    const activeInstance: Instance = instances?.find((instance) => instance.key === instanceKey)
    const activeWorkspace: Workspace = workspaces?.find((workspace) => workspace.attributes.key === workspaceKey)
    const activeProject: Project = projects?.find((project) => project.attributes.key === projectKey)

    return (
        <header className="bg-gray-50 border-b border-gray-200">
            <nav className="mx-auto flex max-w-7xl items-center justify-between py-4 lg:px-8" aria-label="Global">
                <div className="flex items-center gap-x-12 mr-6">
                    <Link to="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Flagbase</span>
                        <img className="h-5 w-auto" src={flag} alt="" />
                    </Link>
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
                <Popover.Group className="hidden lg:flex lg:gap-x-12">
                    <ol role="list" className="flex items-center space-x-4">
                        {instances && (
                            <Breadcrumb
                                chevron={false}
                                name={activeInstance?.key || 'Instances'}
                                type="Instance"
                                description={instancesDescription}
                                href="/instances"
                            >
                                {getInstanceDropdown(instances)}
                            </Breadcrumb>
                        )}
                        {workspaces && instanceKey && (
                            <Breadcrumb
                                type="Workspace"
                                name={activeWorkspace?.attributes.name || 'Workspaces'}
                                description={workspaceDescription}
                                href={getWorkspacesPath(instanceKey || '')}
                            >
                                {getWorkspaceDropdown(workspaces, instanceKey)}
                            </Breadcrumb>
                        )}
                        {projects && instanceKey && (
                            <Breadcrumb
                                type="Project"
                                name={activeProject?.attributes.name || 'Projects'}
                                description={projectsDescription}
                                href={getWorkspacesPath(instanceKey)}
                            >
                                {getProjectDropdown(projects)}
                            </Breadcrumb>
                        )}
                        {environments && instanceKey && workspaceKey && projectKey && (
                            <Breadcrumb
                                type="Environment"
                                name="Environments"
                                description={environmentsDescription}
                                href={getWorkspacesPath(instanceKey)}
                            >
                                {getEnvironmentDropdown(environments, instanceKey, workspaceKey, projectKey)}
                            </Breadcrumb>
                        )}
                    </ol>
                </Popover.Group>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    {/* <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                        Log in <span aria-hidden="true">&rarr;</span>
                    </a> */}
                </div>
            </nav>
            <MobileNavigation
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                instances={instances}
                workspaces={workspaces}
                projects={projects}
            />
        </header>
    )
}

const PageHeading = ({
    title,
    subtitle,
    tabs,
    backHref,
}: {
    title: string
    subtitle: string
    tabs?: { name: string; href: string }[]
    backHref?: string
}) => {
    const location = useLocation()
    const pathname = decodeURI(location.pathname)

    return (
        <header className={`bg-gray-50 pt-8 border-b border-gray-200 ${!tabs || (tabs.length === 0 && 'pb-8')}`}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:flex xl:items-center xl:justify-between">
                <div className="min-w-0 flex-1 flex flex-row items-center gap-5">
                    <button onClick={() => navigate(-1)}>
                        <ArrowLeftCircleIcon className="h-10 w-10 text-gray-400" aria-hidden="true" />
                    </button>
                    <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        {title}
                    </h1>
                </div>
            </div>
            {tabs && tabs.length > 0 && (
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:flex xl:items-center xl:justify-between">
                    {/* Mobile View */}
                    <div className="sm:hidden py-4">
                        <label htmlFor="tabs" className="sr-only">
                            Select a tab
                        </label>
                        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                        <select
                            id="tabs"
                            name="tabs"
                            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                            {tabs.map((tab) => (
                                <option key={tab.name}>{tab.name}</option>
                            ))}
                        </select>
                    </div>
                    {/* Desktop View */}
                    <div className="hidden sm:block">
                        <div>
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                {tabs.map((tab) => (
                                    <Link
                                        key={tab.name}
                                        to={tab.href}
                                        className={classNames(
                                            tab.href === pathname
                                                ? 'border-indigo-500 text-indigo-600'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                            'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
                                        )}
                                        aria-current={tab.href === pathname ? 'page' : undefined}
                                    >
                                        {tab.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}

type PageHeadingType = {
    title: string
    tabs?: { name: string; href: string }[]
    subtitle?: string
    backHref?: string
}

export const PageHeadings = () => {
    const { activeTab } = useParams<{ activeTab: string }>()
    const location = useLocation()

    const [pageHeading, setPageHeading] = useState<PageHeadingType>({
        title: '',
        tabs: [],
    })

    const { instanceKey, workspaceKey, projectKey, environmentKey, sdkKey, flagKey } = useFlagbaseParams()

    const { data: workspaces } = useWorkspaces(instanceKey)
    const workspaceTitle = workspaces?.find((w) => w.attributes.key === workspaceKey)?.attributes.key || workspaceKey

    useEffect(() => {
        if (location.pathname.includes('instances')) {
            setPageHeading({
                title: 'Instances',
                tabs: [],
                backHref: null,
            })
        } else if (instanceKey && workspaceKey && projectKey && flagKey) {
            setPageHeading({
                title: flagKey,
                tabs: [
                    {
                        name: 'Targeting',
                        href: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/flags/environments/${environmentKey}/${flagKey}`,
                    },
                    {
                        name: 'Variations',
                        href: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/flags/${flagKey}/variations`,
                    },
                    {
                        name: 'Settings',
                        href: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/flags/${flagKey}/settings`,
                    },
                ],
            })
        } else if (instanceKey && workspaceKey && projectKey && environmentKey && sdkKey) {
            setPageHeading({
                title: 'SDK Settings',
                subtitle: 'SDK',
                backHref: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/environments/${environmentKey}/sdk-keys`,
                tabs: [
                    {
                        name: 'Settings',
                        href: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/environments/${environmentKey}/sdk-keys/${sdkKey}`,
                    },
                ],
            })
        } else if (instanceKey && workspaceKey && projectKey && environmentKey) {
            setPageHeading({
                title: environmentKey,
                subtitle: 'Environment',
                backHref: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/environments`,
                tabs: [
                    {
                        name: 'SDKs',
                        href: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/environments/${environmentKey}/sdk-keys`,
                    },
                    {
                        name: 'Settings',
                        href: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/environments/${environmentKey}/settings`,
                    },
                ],
            })
        } else if (instanceKey && workspaceKey && projectKey) {
            setPageHeading({
                title: projectKey,
                subtitle: 'Project',
                backHref: `/${instanceKey}/workspaces/${workspaceKey}/projects`,
                tabs: [
                    {
                        name: 'Flags',
                        href: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/flags`,
                    },
                    {
                        name: 'Environments',
                        href: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/environments`,
                    },
                    {
                        name: 'Settings',
                        href: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/settings`,
                    },
                ],
            })
        } else if (instanceKey && workspaceKey) {
            setPageHeading({
                title: workspaceTitle,
                subtitle: 'Workspace',
                backHref: `/${instanceKey}/workspaces`,
                tabs: [
                    {
                        name: 'Projects',
                        href: `/${instanceKey}/workspaces/${workspaceKey}/projects`,
                    },
                    {
                        name: 'Settings',
                        href: `/${instanceKey}/workspaces/${workspaceKey}/settings`,
                    },
                ],
            })
        } else if (instanceKey) {
            setPageHeading({
                title: instanceKey,
                subtitle: 'Instance',
                backHref: '/',
                tabs: [
                    {
                        name: 'Workspaces',
                        href: `/${instanceKey}/workspaces`,
                    },
                    {
                        name: 'Settings',
                        href: `/${instanceKey}/workspaces/settings`,
                    },
                ],
            })
        }
    }, [
        location.pathname,
        activeTab,
        instanceKey,
        workspaceKey,
        projectKey,
        flagKey,
        environmentKey,
        sdkKey,
        workspaceTitle,
    ])

    useEffect(() => {
        if (pageHeading?.title) {
            document.title = `${pageHeading?.title} | Flagbase`
        }
    }, [pageHeading])

    return (
        <>
            <PageHeading
                title={pageHeading.title}
                subtitle={pageHeading.subtitle}
                tabs={pageHeading.tabs}
                backHref={pageHeading.backHref}
            />
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 pt-8">
                <Outlet />
            </div>
        </>
    )
}

const PageLayout: React.FC = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}

export default PageLayout
