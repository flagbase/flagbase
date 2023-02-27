import React, { Fragment } from 'react'

import { PageContainer } from './page-layout.styles'
import { Outlet, useParams } from 'react-router-dom'
import { Instance } from '../../app/context/instance'
import flag from '../../assets/flagbaseLogo.svg'
import { useState } from 'react'
import { Disclosure, Transition, Popover, Dialog, Listbox, Menu } from '@headlessui/react'
import {
    ArrowLeftCircleIcon,
    Bars3Icon,
    BriefcaseIcon,
    CalendarIcon,
    CheckCircleIcon,
    CheckIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    CurrencyDollarIcon,
    LinkIcon,
    MapPinIcon,
    PencilIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { useInstances } from '../../app/pages/instances/instances'
import { getProjectsPath, getWorkspacePath, getWorkspacesPath } from '../../app/router/router'
import { useWorkspaces } from '../../app/pages/workspaces/workspaces.main'
import { Workspace } from '../../app/pages/workspaces/api'
import { useProjects } from '../../app/pages/projects/projects'
import { Project } from '../../app/context/project'

const instancesDescription = `An "instance" refers to a Flagbase core installation, running on a single VPS or clustered in a datacenter.`
const workspaceDescription = `A workspace is the top-level resource which is used to group projects.`
const projectsDescription = `A project is a collection of feature flags and settings. You can have multiple projects in a single workspace.`

const publishingOptions = [
    { name: 'Published', description: 'This job posting can be viewed by anyone who has the link.', current: true },
    { name: 'Draft', description: 'This job posting will no longer be publicly accessible.', current: false },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const MobileDropdown = ({
    name,
    description,
    href,
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

const Dropdown = ({
    name,
    description,
    href,
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
        <Popover className="relative">
            <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 ">
                {name}
                <ChevronDownIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
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
                        <a href={href} className="flex items-center gap-1 mb-2">
                            <ArrowLeftCircleIcon
                                className="h-5 w-5 flex-none text-indigo-600 hover:text-indigo-800"
                                aria-hidden="true"
                            />
                            <h3 className="text-base font-semibold leading-6 text-indigo-600 hover:text-indigo-800">
                                {name}
                            </h3>
                        </a>
                        <p className="mt-1 text-sm text-gray-500">{description}</p>
                    </div>
                    <div className="p-4">
                        {children.map((child) => (
                            <div
                                key={child.name}
                                className="group relative flex gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                            >
                                <div className="flex-auto">
                                    <a href={child.href} className="block font-semibold text-gray-900">
                                        {child.name}
                                        <span className="absolute inset-0" />
                                    </a>
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
        data?.map((object) => {
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
    return (
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
            <div className="fixed inset-0 z-10" />
            <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                <div className="flex items-center justify-between">
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">Flagbase</span>
                        <img className="h-8 w-auto" src={flag} alt="" />
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
                                    children={getProjectDropdown(workspaces)}
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
    const { instanceKey, workspaceKey, projectsKey } =
        useParams<{ instanceKey: string; workspaceKey: string; projectsKey: string }>()

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { data: instances } = useInstances()
    const { data: workspaces } = useWorkspaces(instanceKey || '')
    const { data: projects } = useProjects(instanceKey, workspaceKey)

    return (
        <header className="bg-gray-50 border-b border-gray-200">
            <nav className="mx-auto flex max-w-7xl items-center justify-between py-4 lg:px-8" aria-label="Global">
                <div className="flex items-center gap-x-12 mr-6">
                    <a href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Flagbase</span>
                        <img className="h-8 w-auto" src={flag} alt="" />
                    </a>
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
                    {instances && (
                        <Dropdown
                            name="Instances"
                            description={instancesDescription}
                            href="/instances"
                            children={getInstanceDropdown(instances)}
                        />
                    )}
                    {workspaces && (
                        <Dropdown
                            name="Workspaces"
                            description={workspaceDescription}
                            href={getWorkspacesPath(instanceKey || '')}
                            children={getWorkspaceDropdown(workspaces, instanceKey)}
                        />
                    )}
                    {projects && (
                        <Dropdown
                            name="Projects"
                            description={projectsDescription}
                            href={getWorkspacesPath(instanceKey || '')}
                            children={getProjectDropdown(projects)}
                        />
                    )}
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
            />
        </header>
    )
}

const PageHeading = () => {
    const [selected, setSelected] = useState(0)
    const { instanceKey, workspaceKey, projectsKey } =
        useParams<{ instanceKey: string; workspaceKey: string; projectsKey: string }>()

    const { data: instances } = useInstances()
    const { data: workspaces } = useWorkspaces(instanceKey || '')
    const { data: projects } = useProjects(instanceKey, workspaceKey)

    const buildTitle = () => {
        if (projects) {
            return workspaceKey
        }
        if (workspaces) {
            return instanceKey
        }
        if (instances) {
            return 'Instances'
        }
        return 'Flagbase'
    }

    const buildBreadCrumbs = () => {
        let breadcrumbs = []
        if (instanceKey && instances) {
            breadcrumbs.push({
                name: 'Instances',
                href: '/instances',
            })
        }
        if (workspaces) {
            breadcrumbs.push({
                name: 'Workspaces',
                href: getWorkspacesPath(instanceKey || ''),
            })
        }

        if (projects) {
            breadcrumbs.push({
                name: 'Projects',
                href: getProjectsPath(instanceKey || '', workspaceKey || ''),
            })
        }

        return (
            <nav className="flex" aria-label="Breadcrumb">
                <ol role="list" className="flex items-center space-x-4">
                    {breadcrumbs.map((crumb, index) => (
                        <li key={crumb.name}>
                            <div className="flex items-center">
                                {index !== 0 && (
                                    <ChevronRightIcon
                                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                                        aria-hidden="true"
                                    />
                                )}
                                <a
                                    href={crumb.href}
                                    className={`${
                                        index !== 0 && 'ml-4'
                                    } text-sm font-medium text-gray-500 hover:text-gray-700`}
                                >
                                    {crumb.name}
                                </a>
                            </div>
                        </li>
                    ))}
                </ol>
            </nav>
        )
    }

    return (
        <header className="bg-gray-50 py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:flex xl:items-center xl:justify-between">
                <div className="min-w-0 flex-1">
                    {buildBreadCrumbs()}
                    <h1 className="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        {buildTitle()}
                    </h1>
                    <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-8">
                        <div className="mt-2 flex items-center text-sm text-green-700">
                            <CheckCircleIcon
                                className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-700"
                                aria-hidden="true"
                            />
                            Active
                        </div>
                    </div>
                </div>
                <div className="mt-5 flex xl:mt-0 xl:ml-4">
                    <span className="hidden sm:block">
                        <button
                            type="button"
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                        >
                            <PencilIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                            Edit
                        </button>
                    </span>

                    <span className="ml-3 hidden sm:block">
                        <button
                            type="button"
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                        >
                            <LinkIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                            View
                        </button>
                    </span>

                    <Listbox as="div" value={selected} onChange={setSelected} className="sm:ml-3">
                        {({ open }) => (
                            <>
                                <Listbox.Label className="sr-only"> Change published status </Listbox.Label>
                                <div className="relative">
                                    <div className="inline-flex divide-x divide-green-600 rounded-md shadow-sm">
                                        <div className="inline-flex divide-x divide-green-600 rounded-md shadow-sm">
                                            <div className="inline-flex items-center rounded-l-md border border-transparent bg-green-500 py-2 pl-3 pr-4 text-white shadow-sm">
                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                <p className="ml-2.5 text-sm font-medium">{selected.name}</p>
                                            </div>
                                            <Listbox.Button className="inline-flex items-center rounded-l-none rounded-r-md bg-green-500 p-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                                                <span className="sr-only">Change published status</span>
                                                <ChevronDownIcon className="h-5 w-5 text-white" aria-hidden="true" />
                                            </Listbox.Button>
                                        </div>
                                    </div>

                                    <Transition
                                        show={open}
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="absolute left-0 z-10 mt-2 -mr-1 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:left-auto sm:right-0">
                                            {publishingOptions.map((option) => (
                                                <Listbox.Option
                                                    key={option.name}
                                                    className={({ active }) =>
                                                        classNames(
                                                            active ? 'text-white bg-purple-500' : 'text-gray-900',
                                                            'cursor-default select-none p-4 text-sm'
                                                        )
                                                    }
                                                    value={option}
                                                >
                                                    {({ selected, active }) => (
                                                        <div className="flex flex-col">
                                                            <div className="flex justify-between">
                                                                <p
                                                                    className={
                                                                        selected ? 'font-semibold' : 'font-normal'
                                                                    }
                                                                >
                                                                    {option.name}
                                                                </p>
                                                                {selected ? (
                                                                    <span
                                                                        className={
                                                                            active ? 'text-white' : 'text-purple-500'
                                                                        }
                                                                    >
                                                                        <CheckIcon
                                                                            className="h-5 w-5"
                                                                            aria-hidden="true"
                                                                        />
                                                                    </span>
                                                                ) : null}
                                                            </div>
                                                            <p
                                                                className={classNames(
                                                                    active ? 'text-purple-200' : 'text-gray-500',
                                                                    'mt-2'
                                                                )}
                                                            >
                                                                {option.description}
                                                            </p>
                                                        </div>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Listbox>

                    {/* Dropdown */}
                    <Menu as="div" className="relative ml-3 sm:hidden">
                        <Menu.Button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                            More
                            <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5 text-gray-500" aria-hidden="true" />
                        </Menu.Button>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 z-10 mt-2 -mr-1 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="#"
                                            className={classNames(
                                                active ? 'bg-gray-100' : '',
                                                'block px-4 py-2 text-sm text-gray-700'
                                            )}
                                        >
                                            Edit
                                        </a>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="#"
                                            className={classNames(
                                                active ? 'bg-gray-100' : '',
                                                'block px-4 py-2 text-sm text-gray-700'
                                            )}
                                        >
                                            View
                                        </a>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </div>
        </header>
    )
}

const PageLayout: React.FC = () => {
    return (
        <>
            <Header />
            <PageHeading />
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <Outlet />
            </div>
        </>
    )
}

export default PageLayout
