/* eslint-disable no-return-assign */
/** @jsx jsx */

import React, { useContext, useState } from 'react';
import { Breadcrumb, Menu } from 'antd';

import { jsx } from '@emotion/react';
import { useHistory, Link } from 'react-router-dom';
import { InstanceContext } from '../../app/context/instance';
import { WorkspaceContext } from '../../app/context/workspace';
import { convertWorkspaces } from '../../app/pages/workspaces/workspaces';

const Breadcrumbs: React.FC = ({
}) => {
  const { selectedEntityId, getEntity } = useContext(InstanceContext);
  const {
    entities: workspaces,
    addEntity,
    status: workspaceStatus
  } = useContext(WorkspaceContext);

  const instance = getEntity(selectedEntityId || '');

  
  const workspaceMenu = (
    <Menu>
      {convertWorkspaces(workspaces, instance).map((workspace) => <Menu.Item>
        <Link to={workspace.href}>
          {workspace.name}
        </Link>
      </Menu.Item>)}

    </Menu>
  )

  return (
    <Breadcrumb>
      <Breadcrumb.Item>Flagbase</Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link to="/">Instances</Link>
      </Breadcrumb.Item>
      {selectedEntityId && <Breadcrumb.Item overlay={workspaceMenu}>
        <Link to="/">Workspaces</Link>
      </Breadcrumb.Item>}
      {workspaceStatus === 'loaded' && <Breadcrumb.Item>
        <Link to="/">Projects</Link>
      </Breadcrumb.Item>}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
