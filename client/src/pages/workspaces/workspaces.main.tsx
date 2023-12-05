import React, { Suspense, useState } from 'react';

import { Button, EmptyState, Loader, Input, Table } from '@flagbase/ui';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { Await, useLoaderData, useNavigate } from 'react-router-dom';

import { Workspace } from './api';
import { constants, workspaceColumns } from './workspace.constants';
import { CreateWorkspaceModal } from './workspace.modal';
import { ConvertedWorkspace, convertWorkspaces } from './workspaces.helpers';
import { useWorkspaces } from './workspaces.hooks';
import { APIInstance } from '../instances/instances.functions';

const MainWorkspaces = () => {
  const navigate = useNavigate();
  const { instance, workspaces: prefetchedWorkspaces } = useLoaderData() as {
    workspaces: Workspace[];
    instance: APIInstance;
  };
  const [createWorkspace, showCreateWorkspace] = useState(false);
  const [filter, setFilter] = useState('');
  const {
    data: workspaces,
    isRefetching,
    isFetching,
    isLoading,
  } = useWorkspaces();

  const rowOnClick = (workspace: ConvertedWorkspace) => {
    navigate(workspace.href);
  };

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

            <div className="flex flex-col-reverse items-stretch gap-3 pb-5 md:flex-row">
              <div className="flex-auto">
                <Input
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
              data={
                workspaces
                  ? convertWorkspaces(
                      workspaces,
                      instance,
                      filter.toLowerCase(),
                    )
                  : []
              }
              trOnClick={rowOnClick}
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
