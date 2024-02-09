import React, { Suspense, useState } from 'react';

import { Button, EmptyState, Loader, Input } from '@flagbase/ui';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { Await, useLoaderData } from 'react-router-dom';

import { Workspace } from './api';
import { constants, workspaceColumns } from './workspace.constants';
import { CreateWorkspaceModal } from './workspace.modal';
import { convertWorkspaces } from './workspaces.helpers';
import { useWorkspaces } from './workspaces.hooks';
import { Table } from '../../components/organisms/table/table';
import { Instance } from '../instances/instances.functions';

const MainWorkspaces = () => {
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
  } = useWorkspaces();

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
            <Table
              loading={isFetching || isRefetching || isLoading}
              data={
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
