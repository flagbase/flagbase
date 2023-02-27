import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { RouteParams } from './router.types'
import Instances from '../pages/instances'
import Workspaces from '../pages/workspaces'
import Projects from '../pages/projects'
import Flags from '../pages/flags'
import Segments from '../pages/segments'
import PageLayout from '../../components/page-layout'
import '../tailwind/tailwind.css'

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
                <Route path="/" element={<Instances />} />

                <Route path="/instances" element={<Instances />} />
                {/* Workspaces */}
                <Route path={`/${InstanceKey}/workspaces`} element={<Workspaces />} />
                <Route path={`/${InstanceKey}/workspaces/${WorkspaceKey}`} element={<>Workspace view</>} />
                {/* Projects */}
                <Route path={`/${InstanceKey}/workspaces/${WorkspaceKey}/projects`} element={<Projects />} />
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

export default Router
