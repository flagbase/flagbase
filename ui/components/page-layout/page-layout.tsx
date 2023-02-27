import React, { Fragment } from 'react'

import { PageContainer } from './page-layout.styles'
import { matchPath, useLocation } from 'react-router-dom'
import { Instance } from '../../app/context/instance'
import flag from '../../assets/flagbaseLogo.svg'
import { useState } from 'react'
import { Disclosure, Transition, Popover, Dialog } from '@headlessui/react'
import {
    ArrowLeftCircleIcon,
    ArrowPathIcon,
    Bars3Icon,
    ChartPieIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    CursorArrowRaysIcon,
    FingerPrintIcon,
    PhoneIcon,
    PlayCircleIcon,
    SquaresPlusIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { useInstances } from '../../app/pages/instances/instances'
import { getWorkspacesPath } from '../../app/router/router'
import { useWorkspaces } from '../../app/pages/workspaces/workspaces.main'
import { Workspace } from '../../app/pages/workspaces/api'

const instancesDescription = `An "instance" refers to a Flagbase core installation, running on a single VPS or clustered in a datacenter.`
const workspaceDescription = `A workspace is the top-level resource which is used to group projects.`
const company = [
    { name: 'About us', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Support', href: '#' },
    { name: 'Press', href: '#' },
    { name: 'Blog', href: '#' },
]

const callsToAction = [
    { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
    { name: 'Contact sales', href: '#', icon: PhoneIcon },
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
                            <ArrowLeftCircleIcon className="h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                            <h3 className="text-base font-semibold leading-6 text-indigo-600">{name}</h3>
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

const getWorkspaceDropdown = (data: Workspace[]) => {
    return data.map((object) => {
        return {
            name: object.attributes.name,
            description: object.attributes.description,
            href: getWorkspacesPath(object.attributes.key),
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
}: {
    mobileMenuOpen: boolean
    setMobileMenuOpen: any
    instances?: Instance[]
    workspaces?: Workspace[]
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
                                    children={getWorkspaceDropdown(workspaces)}
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
    const { pathname } = useLocation()
    const match = matchPath({ path: `/:instanceKey/workspaces` }, pathname)
    const instanceKey = match?.params.instanceKey
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { data: instances } = useInstances()
    const { data: workspaces } = useWorkspaces(instanceKey || '')

    return (
        <header className="bg-white shadow">
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
                            children={getWorkspaceDropdown(workspaces)}
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

const PageLayout: React.FC = ({ children }) => {
    return (
        <>
            <Header />

            <PageContainer>{children}</PageContainer>
        </>
    )
}

export default PageLayout
