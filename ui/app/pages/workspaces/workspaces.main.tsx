import React, { Suspense, useState } from 'react';

import { PlusCircleIcon } from '@heroicons/react/20/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from 'react-query';
import { Await, useLoaderData, useParams } from 'react-router-dom';

import {
  createWorkspace,
  deleteWorkspace,
  fetchWorkspaces,
  updateWorkspace,
  Workspace,
} from './api';
import { constants, workspaceColumns } from './workspace.constants';
import { CreateWorkspaceModal } from './workspace.modal';
import { convertWorkspaces } from './workspaces.helpers';
import Button from '../../../components/button';
import EmptyState from '../../../components/empty-state';
import { RawInput } from '../../../components/input/input';
import { Loader } from '../../../components/loader';
import Table from '../../../components/table/table';
import { useNotification } from '../../hooks/use-notification';
import { configureAxios } from '../../lib/axios';
import { useFlagbaseParams } from '../../lib/use-flagbase-params';
import { useInstances } from '../instances/instances';
import { Instance } from '../instances/instances.functions';

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
      await configureAxios(instanceKey!);
      await updateWorkspace({
        workspaceKey: workspaceKey!,
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
        }
        throw new Error('instanceKey is undefined');
      },
      enabled: instances && instances.length > 0,
      ...options,
    },
  );

  return query;
};

const MainWorkspaces = () => {
  const { instanceKey } = useParams() as { instanceKey: string };
  const { instance, workspaces: prefetchedWorkspaces } = useLoaderData() as {
    workspaces: Workspace[];
    instance: Instance;
  };
  const [createWorkspace, showCreateWorkspace] = useState(false);
  const [filter, setFilter] = useState('');
  const {
    data: workspaces,
    isRefetching,
    isFetching,
    isLoading,
  } = useWorkspaces(instanceKey);

  return (
    <Suspense fallback={<Loader />}>
      <Await resolve={prefetchedWorkspaces}>
        {() => (
          <React.Fragment>
            <CreateWorkspaceModal
              visible={createWorkspace}
              setVisible={showCreateWorkspace}
              instance={instance}
            />

            <div className="flex flex-col-reverse md:flex-row gap-3 pb-5 items-stretch">
              <div className="flex-auto">
                <RawInput
                  name="search"
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  label="Search"
                  icon={MagnifyingGlassIcon}
                />
              </div>
            </div>
            <Table
              loading={isFetching || isRefetching || isLoading}
              dataSource={
                workspaces
                  ? convertWorkspaces(
                      workspaces,
                      instance,
                      filter.toLowerCase(),
                    )
                  : []
              }
              columns={workspaceColumns}
              emptyState={
                <EmptyState
                  title="No workspaces found"
                  description="This workspace does not have any workspaces yet."
                  cta={
                    <Button
                      onClick={() => showCreateWorkspace(true)}
                      className="py-2"
                      suffix={PlusCircleIcon}
                    >
                      {constants.create}
                    </Button>
                  }
                />
              }
            />
          </React.Fragment>
        )}
      </Await>
    </Suspense>
  );
};

export default MainWorkspaces;
