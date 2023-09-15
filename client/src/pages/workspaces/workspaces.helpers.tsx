import React from 'react';

import { Button, Tag } from '@flagbase/ui';
import { Link } from 'react-router-dom';

import { Workspace } from './api';
import { Instance } from '../instances/instances.functions';

interface ConvertedWorkspace {
  id: number;
  title: JSX.Element;
  href: string;
  name: JSX.Element;
  action: JSX.Element;
  description: JSX.Element;
  tags: JSX.Element[];
  key: string;
}

export const convertWorkspaces = (
  workspaceList: Workspace[],
  instance: Instance,
  filter: string,
): ConvertedWorkspace[] => {
  if (!workspaceList) {
    return [];
  }

  return workspaceList
    .filter((workspace) => {
      const { name, key, description } = workspace.attributes;

      return (
        name?.toLowerCase().includes(filter) ||
        key?.toLowerCase().includes(filter) ||
        description?.toLowerCase().includes(filter)
      );
    })
    .map((currentWorkspace, index) => {
      return {
        id: index,
        title: <span>{currentWorkspace.attributes.name}</span>,
        href: `/${instance.key}/workspaces/${currentWorkspace?.attributes.key}/projects`,
        name: (
          <Link
            to={`/${instance.key}/workspaces/${currentWorkspace?.attributes.key}/projects`}
          >
            <span>{currentWorkspace.attributes.name}</span>
          </Link>
        ),
        action: (
          <Link
            to={`/${instance.key}/workspaces/${currentWorkspace?.attributes.key}/projects`}
          >
            <Button secondary className="py-2">
              Connect
            </Button>
          </Link>
        ),
        description: <span>{currentWorkspace.attributes.description}</span>,
        tags: currentWorkspace.attributes.tags.map((tag: string) => (
          <Tag key={tag} className="mr-2">
            {tag}
          </Tag>
        )),
        key: currentWorkspace.attributes.key,
      };
    });
};
