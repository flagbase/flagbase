import React, { useState } from 'react';

import { Popover } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

import Breadcrumb from './breadcrumb';
import MobileNavigation from './mobile-navigation';
import {
  environmentsDescription,
  flagsDescription,
  getEnvironmentDropdown,
  getFlagDropdown,
  getInstanceDropdown,
  getProjectDropdown,
  getWorkspaceDropdown,
  instancesDescription,
  projectsDescription,
  workspaceDescription,
} from './utils';
import { useFlagbaseParams } from '../../lib/use-flagbase-params';
import { useActiveEnvironment } from '../../pages/environments/environment-dropdown';
import { useEnvironments } from '../../pages/environments/environments';
import { useFlags } from '../../pages/flags/flags.hooks';
import { useInstances } from '../../pages/instances/instances.hooks';
import { useProjects } from '../../pages/projects/projects.hooks';
import { useWorkspaces } from '../../pages/workspaces/workspaces.hooks';
import {
  getWorkspacesPath,
  getProjectsPath,
  getFlagsPath,
} from '../../router/router.paths';

function Header() {
  const { instanceKey, workspaceKey, projectKey, flagKey } =
    useFlagbaseParams();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: instances } = useInstances();
  const { data: workspaces } = useWorkspaces();
  const { data: projects } = useProjects();
  const { data: environments } = useEnvironments();
  const { data: flags } = useFlags();
  const { data: activeEnvironmentKey } = useActiveEnvironment();

  const activeInstance = instances?.find(
    (instance) => instance.key === instanceKey,
  );
  const activeWorkspace = workspaces?.find(
    (workspace) => workspace.attributes.key === workspaceKey,
  );
  const activeProject = projects?.find(
    (project) => project.attributes.key === projectKey,
  );
  const activeEnvironment = environments?.find(
    (environment) => environment.attributes.key === activeEnvironmentKey,
  );
  const activeFlag = flags?.find((flag) => flag.attributes.key === flagKey);

  return (
    <header className="border-b border-gray-200 bg-gray-50">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
        aria-label="Global"
      >
        <div className="mr-10 flex items-center gap-x-12">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Flagbase</span>
            {/* <img className="h-5 w-auto" src={flag as string} alt="" /> */}
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12">
          <ol role="list" className="flex items-center space-x-4">
            {instances && (
              <Breadcrumb
                chevron={false}
                name={activeInstance?.name || 'Instances'}
                type="Instance"
                description={instancesDescription}
                href="/instances"
              >
                {getInstanceDropdown(instances)}
              </Breadcrumb>
            )}
            {workspaces && instanceKey && (
              <Breadcrumb
                type="Workspace"
                name={activeWorkspace?.attributes.name || 'Workspaces'}
                description={workspaceDescription}
                href={getWorkspacesPath(instanceKey || '')}
              >
                {getWorkspaceDropdown(workspaces, instanceKey)}
              </Breadcrumb>
            )}
            {projects && instanceKey && workspaceKey && (
              <Breadcrumb
                type="Project"
                name={activeProject?.attributes.name || 'Projects'}
                description={projectsDescription}
                href={getProjectsPath(instanceKey, workspaceKey)}
              >
                {getProjectDropdown(projects, workspaceKey, instanceKey)}
              </Breadcrumb>
            )}
            {environments && instanceKey && workspaceKey && projectKey && (
              <Breadcrumb
                type="Environment"
                name={activeEnvironment?.attributes.name || 'Environments'}
                description={environmentsDescription}
                href={getWorkspacesPath(instanceKey)}
              >
                {getEnvironmentDropdown(
                  environments,
                  instanceKey,
                  workspaceKey,
                  projectKey,
                )}
              </Breadcrumb>
            )}

            {flags && instanceKey && workspaceKey && projectKey && (
              <Breadcrumb
                type="Flag"
                name={activeFlag?.attributes.name || 'Flags'}
                description={flagsDescription}
                href={getFlagsPath(instanceKey, workspaceKey, projectKey)}
              >
                {getFlagDropdown(
                  flags,
                  instanceKey,
                  workspaceKey,
                  activeEnvironmentKey,
                  projectKey,
                )}
              </Breadcrumb>
            )}
          </ol>
        </Popover.Group>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {/* <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                              Log in <span aria-hidden="true">&rarr;</span>
                          </a> */}
        </div>
      </nav>
      <MobileNavigation
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
    </header>
  );
}

export default Header;
