import React, { Suspense } from 'react';

import {
  Button,
  StackedEntityList,
  StackedEntityListProps,
  Loader,
  Tag,
} from '@flagbase/ui';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Await, useLoaderData } from 'react-router-dom';

import {
  fetchEnvironments,
  createEnvironment,
  EnvironmentCreateBody,
} from './api';
import { configureAxios } from '../../lib/axios';
import { useFlagbaseParams } from '../../lib/use-flagbase-params';
import { getEnvironmentsKey } from '../../router/loaders';
import { useInstances } from '../instances/instances.hooks';

export type Environment = {
  type: string;
  id: string;
  attributes: {
    description: string;
    key: string;
    name: string;
    tags: string[];
  };
};

export const useEnvironments = () => {
  const { instanceKey, workspaceKey, projectKey } = useFlagbaseParams();
  const { data: instances } = useInstances({
    select: (instances) =>
      instances.filter((instance) => instance.key === instanceKey),
  });
  const query = useQuery<Environment[]>(
    getEnvironmentsKey({
      instanceKey: instanceKey!,
      workspaceKey: workspaceKey!,
      projectKey: projectKey!,
    }),
    {
      queryFn: async () => {
        await configureAxios(instanceKey!);

        return fetchEnvironments(workspaceKey!, projectKey!);
      },
      enabled:
        !!instanceKey &&
        !!workspaceKey &&
        !!projectKey &&
        instances &&
        instances.length > 0,
    },
  );

  return query;
};

export const useAddEnvironment = () => {
  const queryClient = useQueryClient();
  const { instanceKey, workspaceKey, projectKey } = useFlagbaseParams();
  const mutation = useMutation({
    mutationFn: async (values: EnvironmentCreateBody) => {
      await createEnvironment({
        workspaceKey: workspaceKey!,
        projectKey: projectKey!,
        environment: values,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getEnvironmentsKey({
          instanceKey: instanceKey!,
          workspaceKey: workspaceKey!,
          projectKey: projectKey!,
        }),
      });
    },
  });

  return mutation;
};

const Environments = () => {
  const { environments: prefetchedEnvironments } = useLoaderData() as {
    environments: Environment[];
  };
  const { instanceKey, workspaceKey, projectKey } = useFlagbaseParams();
  const convertEnvironmentsToList: StackedEntityListProps = (
    environments: Environment[],
  ) => {
    return environments.map((environment) => {
      return {
        id: environment.id,
        title: environment.attributes.name,
        href: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/environments/${environment.attributes.key}/sdk-keys`,
        name: environment.attributes.name,
        description: environment.attributes.description,
        tags: environment.attributes.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        )),
        action: (
          <div>
            <Button secondary className="py-2">
              Connect
            </Button>
          </div>
        ),
        key: environment.attributes.key,
      };
    });
  };

  const { data: environments } = useEnvironments();

  return (
    <Suspense fallback={<Loader />}>
      <Await resolve={prefetchedEnvironments}>
        {() => (
          <div className="mt-5">
            <StackedEntityList
              entities={convertEnvironmentsToList(environments)}
            />
          </div>
        )}
      </Await>
    </Suspense>
  );
};

export default Environments;
