/* eslint-disable no-return-assign */
/** @jsx jsx */

import React, { useContext, useState } from 'react';
import { Breadcrumb, Menu } from 'antd';

import { jsx } from '@emotion/react';
import { useHistory, Link } from 'react-router-dom';
import { InstanceContext } from '../../app/context/instance';
import { WorkspaceContext } from '../../app/context/workspace';

const Breadcrumbs: React.FC = ({
}) => {
  const { selectedEntityId } = useContext(InstanceContext);
  const {
    entities: workspaces,
    addEntity,
    status: workspaceStatus
  } = useContext(WorkspaceContext);

  const menu = (
    <Menu>
      <Menu.Item>
        <Link to="/">
          Instances
        </Link>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
          Layout
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
          Navigation
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Breadcrumb>
      <Breadcrumb.Item>Flagbase</Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link to="/">Instances</Link>
      </Breadcrumb.Item>
      {selectedEntityId && <Breadcrumb.Item>
        <Link to="/">Workspaces</Link>
      </Breadcrumb.Item>}
      {workspaceStatus === 'loaded' && <Breadcrumb.Item>
        <Link to="/">Projects</Link>
      </Breadcrumb.Item>}
      <Breadcrumb.Item overlay={menu}>
        <a href="">General</a>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
