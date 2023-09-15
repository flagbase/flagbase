import React from 'react';

import { Tag, Text } from '@flagbase/ui';
import {
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';

import {
  createProject,
  deleteProject,
  fetchProjects,
  Project,
  ProjectResponse,
} from './api';
import { configureAxios } from '../../lib/axios';
import { useFlagbaseParams } from '../../lib/use-flagbase-params';
import { Workspace } from '../workspaces/api';

export const convertProjects = ({
  projects,
  instanceKey,
  workspaceKey,
  filter = '',
}: {
  projects: ProjectResponse;
  instanceKey: string;
  workspaceKey: string;
  filter: string;
}) => {
  if (!projects) {
    return [];
  }

  return Object.values(projects)
    .filter((project) => {
      const { name, key, description } = project.attributes;

      return (
        name.toLowerCase().includes(filter) ||
        key.toLowerCase().includes(filter) ||
        description.toLowerCase().includes(filter)
      );
    })
    .map((project: Project, index: number) => {
      return {
        id: index,
        title: project.attributes.name,
        href: `/${instanceKey}/workspaces/${workspaceKey}/projects/${project.attributes.key}/flags`,
        name: <Text>{project.attributes.name}</Text>,
        description: <Text>{project.attributes.description}</Text>,
        tags: (
          <div>
            {project.attributes.tags.map((tag) => (
              <Tag key={tag} className="mr-2">
                {tag}
              </Tag>
            ))}
          </div>
        ),
        key: project.attributes.key,
      };
    });
};

export const useRemoveProject = () => {
  const { instanceKey, workspaceKey, projectKey } = useFlagbaseParams();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ['projects', instanceKey, workspaceKey],
    mutationFn: async () => {
      if (!workspaceKey || !projectKey) {
        throw new Error('Workspace key is required');
      }
      await deleteProject({ projectKey, workspaceKey });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['projects', instanceKey, workspaceKey],
      });
    },
  });

  return mutation;
};

export const useAddProject = () => {
  const { instanceKey, workspaceKey } = useFlagbaseParams();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ['projects', instanceKey, workspaceKey],
    mutationFn: async (values: Omit<Workspace['attributes'], 'key'>) => {
      if (!workspaceKey) {
        throw new Error('Workspace key is required');
      }
      await createProject(
        values.name,
        values.description,
        values.tags,
        workspaceKey,
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['projects', instanceKey, workspaceKey],
      });
    },
  });

  return mutation;
};

export const useProjects = (options?: UseQueryOptions<Project[]>) => {
  const { instanceKey, workspaceKey } = useFlagbaseParams();
  const query = useQuery<Project[]>(['projects', instanceKey, workspaceKey], {
    queryFn: async () => {
      if (!instanceKey || !workspaceKey) {
        throw new Error('Workspace key is required');
      }
      await configureAxios(instanceKey);

      return fetchProjects(workspaceKey);
    },
    enabled: !!instanceKey && !!workspaceKey,
    ...options,
  });

  return query;
};
