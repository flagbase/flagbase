import React, { Suspense, useState } from 'react';

import { Button, EmptyState, Loader } from '@flagbase/ui';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Await, useLoaderData } from 'react-router-dom';

import { Project } from './api';
import { constants, projectsColumn } from './projects.constants';
import { convertProjects, useProjects } from './projects.hooks';
import { CreateProjectModal } from './projects.modal';
import { Table } from '../../components/organisms/table/table';
import { useFlagbaseParams } from '../../lib/use-flagbase-params';

const Projects = () => {
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState('');
  const { projects: prefetchedProjects } = useLoaderData() as {
    projects: Project[];
  };
  const { instanceKey, workspaceKey } = useFlagbaseParams();
  const { data: projects } = useProjects();

  return (
    <Suspense fallback={<Loader />}>
      <Await resolve={prefetchedProjects}>
        <div className="mt-5">
          <CreateProjectModal visible={visible} setVisible={setVisible} />

          <div className="flex flex-col-reverse items-stretch gap-3 pb-5 md:flex-row">
            <div className="flex-auto">
              {/* <RawInput
                onChange={(event) => setFilter(event.target.value)}
                value={filter}
                icon={MagnifyingGlassIcon}
                label="Search Projects"
              /> */}
            </div>
          </div>

          {projects && workspaceKey && instanceKey && (
            <Table
              data={convertProjects({
                projects,
                workspaceKey,
                instanceKey,
                filter,
              })}
              columns={projectsColumn}
              emptyState={
                <EmptyState
                  title="No Projects"
                  description={'Get started by creating a new project.'}
                  cta={
                    <Button
                      className="py-2"
                      suffix={PlusCircleIcon}
                      onClick={() => setVisible(true)}
                    >
                      {constants.create}
                    </Button>
                  }
                />
              }
            />
          )}
        </div>
      </Await>
    </Suspense>
  );
};

export default Projects;
