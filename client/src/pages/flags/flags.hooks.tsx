import React from 'react';

import { Button, Loader, Tag, Text } from '@flagbase/ui';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import {
  createFlag,
  deleteFlag,
  fetchFlags,
  Flag,
  FlagCreateBody,
  updateFlag,
} from './api';
import { configureAxios } from '../../lib/axios';
import { useFlagbaseParams } from '../../lib/use-flagbase-params';
import { getFlagsKey } from '../../router/loaders';
import { useActiveEnvironment } from '../environments/environment-dropdown';
import { Environment, useEnvironments } from '../environments/environments';
import { useInstances } from '../instances/instances.hooks';

export const useChangeDefaultEnvironment = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (newEnvironment: Environment) => {
      return newEnvironment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['defaultEnvironment']);
    },
  });

  return mutation;
};

const FlagLink = ({ flag }: { flag: Flag }) => {
  const { data: environmentKey, isLoading } = useActiveEnvironment();
  const { data: environments } = useEnvironments();
  const environment = environments?.find(
    (env) => env.attributes.key === environmentKey,
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Link
      to={`${flag.attributes.key}/environments/${environment?.attributes.key}`}
    >
      <Button variant="secondary" className="py-2">
        Modify
      </Button>
    </Link>
  );
};
export const convertFlags = ({
  flags,
  environment,
}: {
  flags: Flag[];
  environment: Environment;
}) => {
  if (!flags) {
    return [];
  }

  return Object.values(flags).map((flag: Flag, index: number) => {
    return {
      id: index,
      key: flag.attributes.key,
      title: flag.attributes.name,
      href: `${flag.attributes.key}/environments/${environment?.attributes.key}`,
      name: <Text>{flag.attributes.name}</Text>,
      description: <Text>{flag.attributes.description}</Text>,
      tags: (
        <div>
          {(flag.attributes.tags || []).map((tag) => (
            <Tag key={tag} className="mr-2">
              {tag}
            </Tag>
          ))}
        </div>
      ),
      action: <FlagLink flag={flag} />,
      flagKey: flag.attributes.key,
    };
  });
};

export const useUpdateFlag = () => {
  const queryClient = useQueryClient();
  const { workspaceKey, projectKey, environmentKey, instanceKey, flagKey } =
    useFlagbaseParams();
  const mutation = useMutation({
    mutationFn: async (values: {
      description: string;
      tags: string[];
      name: string;
      key: string;
    }) => {
      if (!instanceKey || !workspaceKey || !projectKey || !flagKey) {
        return;
      }
      await configureAxios(instanceKey);
      await updateFlag({
        workspaceKey: workspaceKey,
        projectKey: projectKey,
        environmentKey: environmentKey,
        flagKey: flagKey,
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getFlagsKey({
          instanceKey,
          workspaceKey,
          projectKey,
        }),
      });
    },
  });

  return mutation;
};

export const useRemoveFlag = () => {
  const { instanceKey, workspaceKey, projectKey, flagKey } =
    useFlagbaseParams();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      if (!instanceKey || !workspaceKey || !projectKey || !flagKey) {
        return;
      }
      await configureAxios(instanceKey);

      return deleteFlag({
        workspaceKey,
        projectKey,
        flagKey,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getFlagsKey({
          instanceKey,
          workspaceKey,
          projectKey,
        }),
      });
    },
  });

  return mutation;
};

export const useAddFlag = () => {
  const { instanceKey, workspaceKey, projectKey } = useFlagbaseParams();
  const queryClient = useQueryClient();

  return useMutation(
    (flag: FlagCreateBody) =>
      createFlag({
        workspaceKey,
        projectKey,
        flag,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          getFlagsKey({ instanceKey, workspaceKey, projectKey }),
        );
      },
    },
  );
};

export const useFlags = () => {
  const { instanceKey, workspaceKey, projectKey } = useFlagbaseParams();
  const { data: instances } = useInstances({
    select: (instances) =>
      instances.filter((instance) => instance.key === instanceKey),
  });
  const query = useQuery<Flag[]>(
    getFlagsKey({
      instanceKey,
      workspaceKey,
      projectKey,
    }),
    {
      queryFn: async () => {
        if (!instanceKey || !workspaceKey || !projectKey) {
          return [];
        }
        await configureAxios(instanceKey);

        return fetchFlags({
          workspaceKey: workspaceKey,
          projectKey: projectKey,
        });
      },
      enabled:
        !!workspaceKey && !!projectKey && instances && instances.length > 0,
    },
  );

  return query;
};
