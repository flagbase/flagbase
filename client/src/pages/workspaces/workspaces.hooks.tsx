import { useNotification } from '@flagbase/ui';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from 'react-query';

import {
  createWorkspace,
  deleteWorkspace,
  fetchWorkspaces,
  updateWorkspace,
  Workspace,
} from './api';
import { configureAxios } from '../../lib/axios';
import { useFlagbaseParams } from '../../lib/use-flagbase-params';
import { useInstances } from '../instances/instances.hooks';

export const useAddWorkspace = () => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  const { instanceKey } = useFlagbaseParams();
  const mutation = useMutation({
    mutationFn: async (values: Omit<Workspace['attributes'], 'key'>) => {
      await createWorkspace({
        name: values.name,
        description: values.description,
        tags: values.tags,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['workspaces', instanceKey],
      });
      notification.addNotification({
        type: 'success',
        title: 'Success',
        content: 'Workspace created',
      });
    },
  });

  return mutation;
};
export const useUpdateWorkspace = (instanceKey: string | undefined) => {
  const queryClient = useQueryClient();
  const { workspaceKey } = useFlagbaseParams();
  const mutation = useMutation({
    mutationFn: async (values: {
      name: string;
      key: string;
      description: string;
      tags: string[];
    }) => {
      if (!instanceKey || !workspaceKey) {
        throw new Error('instanceKey is undefined');
      }

      await configureAxios(instanceKey);
      await updateWorkspace({
        workspaceKey,
        body: [
          {
            op: 'replace',
            path: '/name',
            value: values.name,
          },
          {
            op: 'replace',
            path: '/key',
            value: values.key,
          },
          {
            op: 'replace',
            path: '/description',
            value: values.description,
          },
          {
            op: 'replace',
            path: '/tags',
            value: values.tags,
          },
        ],
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['workspaces', instanceKey],
      });
    },
  });

  return mutation;
};

export const useRemoveWorkspace = (instanceKey: string | undefined) => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  const mutation = useMutation({
    mutationFn: async (key: string) => {
      if (!instanceKey) {
        throw new Error('instanceKey is undefined');
      }
      await configureAxios(instanceKey);

      return deleteWorkspace(key);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['workspaces', instanceKey?.toLocaleLowerCase()],
      });
      notification.addNotification({
        type: 'success',
        title: 'Success',
        content: 'Workspace deleted',
      });
    },
  });

  return mutation;
};

export const useWorkspaces = (options?: UseQueryOptions<Workspace[]>) => {
  const { instanceKey } = useFlagbaseParams();
  const { data: instances } = useInstances({
    select: (instances) =>
      instances.filter((instance) => instance.key === instanceKey),
  });
  const query = useQuery<Workspace[]>(
    ['workspaces', instanceKey?.toLocaleLowerCase()],
    {
      queryFn: async () => {
        if (instanceKey) {
          await configureAxios(instanceKey);

          return fetchWorkspaces();
        } else {
          throw new Error('instanceKey is undefined');
        }
      },
      enabled: instances && instances.length > 0,
      ...options,
    },
  );

  return query;
};
