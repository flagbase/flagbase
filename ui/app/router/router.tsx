import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

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
      <Switch>
        {/* Instances */}
        <Route path="/" component={Instances} />
        <Route path="/instances" component={Instances} />
        {/* Workspaces */}
        <Route path={`/workspaces/${InstanceKey}`} component={Workspaces} />
        {/* Projects */}
        <Route
          path={`/projects/${InstanceKey}/${WorkspaceKey}`}
          component={Projects}
        />
        {/* Flags */}
        <Route
          path={`/flags/${InstanceKey}/${WorkspaceKey}/${ProjectKey}/${EnvironmentKey}`}
          component={Flags}
        />
        {/* Segments */}
        <Route
          path={`/segments/${InstanceKey}/${WorkspaceKey}/${ProjectKey}/${EnvironmentKey}`}
          component={Segments}
        />
        {/* Identities */}
        <Route
          path={`/identities/${InstanceKey}/${WorkspaceKey}/${ProjectKey}/${EnvironmentKey}`}
          component={Identities}
        />
        {/* Traits */}
        <Route
          path={`/traits/${InstanceKey}/${WorkspaceKey}/${ProjectKey}/${EnvironmentKey}`}
          component={Traits}
        />
      </Switch>
    </BrowserRouter>
  </Context>
);

export default Router;
