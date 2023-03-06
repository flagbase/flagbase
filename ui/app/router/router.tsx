import React from 'react'
import { Route, Navigate, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

import { RouteParams } from './router.types'
import Instances from '../pages/instances'
import Projects from '../pages/projects'
import Flags from '../pages/flags'
import PageLayout from '../../components/page-layout'
import '../tailwind/tailwind.css'
import { PageHeadings } from '../../components/page-layout/page-layout'
import EditProject from '../pages/projects/projects.edit'
import { environmentsLoader, instancesLoader, projectsLoader, workspacesLoader } from './loaders'
import { QueryClient } from 'react-query'
import MainWorkspaces from '../pages/workspaces/workspaces.main'
import Environments from '../pages/projects/environments'
import { Error } from '../pages/error'
import { Project } from '../pages/projects/project'
import { EditInstance } from '../pages/instances/instances.settings'
import { EditWorkspace } from '../pages/workspaces/workspaces.edit'

const { InstanceKey, WorkspaceKey, ProjectKey, EnvironmentKey, FlagKey, SegmentKey } = RouteParams

export const getWorkspacesPath = (instanceKey: string) => `/${instanceKey}/workspaces`
export const getWorkspacePath = (instanceKey: string, workspaceKey: string) =>
    `/${instanceKey}/workspaces/${workspaceKey}/projects`

export const getProjectsPath = (instanceKey: string, workspaceKey: string) =>
    `/${instanceKey}/workspaces/${workspaceKey}/projects`

export const getProjectPath = (instanceKey: string, workspaceKey: string, projectKey: string) =>
    `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}`

export const queryClient = new QueryClient()

export const newRouter = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<PageLayout />}>
            <Route path="/" element={<Navigate to="/instances" />} />
            <Route path="/instances" element={<PageHeadings />}>
                <Route loader={instancesLoader(queryClient)} path="" element={<Instances />} />
            </Route>
            <Route path={`/${InstanceKey}/workspaces`} element={<PageHeadings />}>
                <Route
                    loader={({ params }) => workspacesLoader({ queryClient, params })}
                    errorElement={<Error />}
                    path=""
                    element={<MainWorkspaces />}
                />
                <Route path="settings" element={<EditInstance />} />
                <Route path={`${WorkspaceKey}`}>
                    <Route path="settings" element={<EditWorkspace />} />
                    <Route path="" element={<>Workspace view</>} />
                    <Route path="projects">
                        <Route
                            loader={({ params }) => projectsLoader({ queryClient, params })}
                            path=""
                            element={<Projects />}
                        />

                        <Route path={`${ProjectKey}`}>
                            <Route path="settings" element={<EditProject />} />
                            <Route path="" element={<Project />} />

                            <Route
                                loader={({ params }) => environmentsLoader({ queryClient, params })}
                                path="environments"
                                element={<Environments />}
                            />
                            <Route path={`flags/${EnvironmentKey}`} element={<Flags />} />
                            <Route path={`flags/${FlagKey}/${EnvironmentKey}`} element={<>Flag view</>} />
                        </Route>
                    </Route>
                </Route>
            </Route>
        </Route>
    )
)
