import React from 'react'
import {
    BrowserRouter,
    Routes,
    Route,
    Outlet,
    Navigate,
    createBrowserRouter,
    createRoutesFromElements,
} from 'react-router-dom'

import { RouteParams } from './router.types'
import Instances from '../pages/instances'
import Workspaces from '../pages/workspaces'
import Projects from '../pages/projects'
import Flags from '../pages/flags'
import Segments from '../pages/segments'
import PageLayout from '../../components/page-layout'
import '../tailwind/tailwind.css'
import { PageHeadings } from '../../components/page-layout/page-layout'
import EditInstance from '../pages/workspaces/workspaces.edit'
import EditProject from '../pages/projects/projects.edit'

const { InstanceKey, WorkspaceKey, ProjectKey, EnvironmentKey, FlagKey, SegmentKey } = RouteParams

export const getWorkspacesPath = (instanceKey: string) => `/${instanceKey}/workspaces`
export const getWorkspacePath = (instanceKey: string, workspaceKey: string) =>
    `/${instanceKey}/workspaces/${workspaceKey}/projects`

export const getProjectsPath = (instanceKey: string, workspaceKey: string) =>
    `/${instanceKey}/workspaces/${workspaceKey}/projects`

export const getProjectPath = (instanceKey: string, workspaceKey: string, projectKey: string) =>
    `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}`

const Router: React.FC = () => (
    <BrowserRouter>
        <Routes>
            {/* Instances */}
            <Route path="/" element={<PageLayout />}>
                <Route path="/" element={<Navigate to="/instances" />} />
                <Route path="/instances" element={<PageHeadings />}>
                    <Route path=":activeTab" element={<Instances />} />
                    <Route path="" element={<Instances />} />
                </Route>
                {/* Workspaces */}
                <Route path={`/${InstanceKey}/workspaces`} element={<PageHeadings />}>
                    <Route path="" element={<Workspaces />} />
                    <Route path=":activeTab" element={<Workspaces />} />

                    <Route path={`/${InstanceKey}/workspaces/${WorkspaceKey}`} element={<>Workspace view</>} />
                </Route>
                {/* Projects */}
                <Route path={`/${InstanceKey}/workspaces/${WorkspaceKey}/projects`} element={<PageHeadings />}>
                    <Route path="" element={<Projects />} />
                    <Route path=":activeTab" element={<Projects />} />
                </Route>
                <Route
                    path={`/${InstanceKey}/workspaces/${WorkspaceKey}/projects/${ProjectKey}`}
                    element={<>Project view</>}
                />
                {/* Flags */}
                <Route
                    path={`/${InstanceKey}/workspaces/${WorkspaceKey}/projects/${ProjectKey}/flags/${EnvironmentKey}`}
                    element={<Flags />}
                />
                <Route
                    path={`/${InstanceKey}/workspaces/${WorkspaceKey}/projects/${ProjectKey}/flags/${FlagKey}/${EnvironmentKey}`}
                    element={<>Flag view</>}
                />
                {/* Segments */}
                <Route
                    path={`/${InstanceKey}/workspaces/${WorkspaceKey}/projects/${ProjectKey}/segments`}
                    element={<Segments />}
                />
                <Route
                    path={`/${InstanceKey}/workspaces/${WorkspaceKey}/projects/${ProjectKey}/segments/${SegmentKey}`}
                    element={<>Segment view</>}
                />
            </Route>
        </Routes>
    </BrowserRouter>
)

export const newRouter = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<PageLayout />}>
            <Route path="/" element={<Navigate to="/instances" />} />
            <Route path="/instances" element={<PageHeadings />}>
                <Route path=":activeTab" element={<Instances />} />
                <Route path="" element={<Instances />} />
            </Route>
            <Route path={`/${InstanceKey}/workspaces`} element={<PageHeadings />}>
                <Route path="" element={<Workspaces />} />
                <Route path="settings" element={<EditInstance />} />
                <Route path={`${WorkspaceKey}`}>
                    <Route path="" element={<>Workspace view</>} />
                    <Route path="projects">
                        <Route path="" element={<Projects />} />
                        <Route path="settings" element={<EditProject />} />
                        <Route path={`${ProjectKey}`}>
                            <Route path="" element={<>Project view</>} />
                            <Route path={`flags/${EnvironmentKey}`} element={<Flags />} />
                            <Route path={`flags/${FlagKey}/${EnvironmentKey}`} element={<>Flag view</>} />
                        </Route>
                    </Route>
                </Route>
            </Route>
        </Route>
    )
)

export default Router
