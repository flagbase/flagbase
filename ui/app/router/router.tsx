import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { RouteParams } from './router.types'
import Instances from '../pages/instances'
import Workspaces from '../pages/workspaces'
import Projects from '../pages/projects'
import Flags from '../pages/flags'
import Segments from '../pages/segments'
import Identities from '../pages/identities'
import Traits from '../pages/traits'
import PageLayout from '../../components/page-layout'
import AppNavigation from '../../components/app-navigation'
import '../tailwind/tailwind.css'

const { InstanceKey, WorkspaceKey, ProjectKey, EnvironmentKey, FlagKey, SegmentKey } = RouteParams

// http://localhost:4000/%7BinstanceKey%7D/workspaces/%7BworkspaceKey%7D/projects/%7BprojectKey%7D/flag/%7BflagKey%7D

const Router: React.FC = () => (
    <BrowserRouter>
        <PageLayout navigation={<AppNavigation title="Flagbase" hasBackIcon />}>
            <Routes>
                {/* Instances */}
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
            </Routes>
        </PageLayout>
    </BrowserRouter>
)

export default Router
