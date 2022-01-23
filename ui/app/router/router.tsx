import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { RouteParams } from './router.types';
import Context from '../context';
import Instances from '../pages/instances';
import Workspaces from '../pages/workspaces';
import Projects from '../pages/projects';
import Flags from '../pages/flags';
import Segments from '../pages/segments';
import Identities from '../pages/identities';
import Traits from '../pages/traits';

const {
  InstanceKey,
  WorkspaceKey,
  ProjectKey,
  EnvironmentKey
  // FlagKey,
  // SegmentKey,
  // IdentityKey,
  // TraitKey
} = RouteParams;

const Router: React.FC = () => (
  <Context>
    <BrowserRouter>
      <Routes>
        {/* Instances */}
        <Route path="/" element={<Instances />} />
        <Route path="/instances" element={<Instances />} />
        {/* Workspaces */}
        <Route path={`/workspaces/${InstanceKey}`} element={<Workspaces />} />
        {/* Projects */}
        <Route
          path={`/projects/${InstanceKey}/${WorkspaceKey}`}
          element={<Projects />}
        />
        {/* Flags */}
        <Route
          path={`/flags/${InstanceKey}/${WorkspaceKey}/${ProjectKey}/${EnvironmentKey}`}
          element={<Flags />}
        />
        {/* Segments */}
        <Route
          path={`/segments/${InstanceKey}/${WorkspaceKey}/${ProjectKey}/${EnvironmentKey}`}
          element={<Segments />}
        />
        {/* Identities */}
        <Route
          path={`/identities/${InstanceKey}/${WorkspaceKey}/${ProjectKey}/${EnvironmentKey}`}
          element={<Identities />}
        />
        {/* Traits */}
        <Route
          path={`/traits/${InstanceKey}/${WorkspaceKey}/${ProjectKey}/${EnvironmentKey}`}
          element={<Traits />}
        />
      </Routes>
    </BrowserRouter>
  </Context>
);

export default Router;
