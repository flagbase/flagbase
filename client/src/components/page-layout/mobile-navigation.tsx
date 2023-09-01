import React from 'react';

import { Logo } from '@flagbase/ui';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

import MobileDropdown from './mobile-dropdown';
import {
  getInstanceDropdown,
  getWorkspaceDropdown,
  getProjectDropdown,
  getEnvironmentDropdown,
  getFlagDropdown,
} from './utils';
import { useFlagbaseParams } from '../../lib/use-flagbase-params';
import { useActiveEnvironment } from '../../pages/environments/environment-dropdown';
import { useEnvironments } from '../../pages/environments/environments';
import { useFlags } from '../../pages/flags/flags.hooks';
import { useInstances } from '../../pages/instances/instances.hooks';
import { useProjects } from '../../pages/projects/projects.hooks';
import { useWorkspaces } from '../../pages/workspaces/workspaces.hooks';

const instancesDescription = `An "instance" refers to a Flagbase core installation, running on a single VPS or clustered in a datacenter.`;
const workspaceDescription = `A workspace is the top-level resource which is used to group projects.`;
const projectsDescription = `A project is a collection of feature flags and settings. You can have multiple projects in a single workspace.`;
const environmentsDescription = `An environment is a set of feature flags and settings that can be applied to a specific set of users.`;
const flagsDescription = `A feature flag is a boolean value that determines whether a feature is enabled or disabled.`;

function MobileNavigation({
  mobileMenuOpen,
  setMobileMenuOpen,
}: {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (value: boolean) => void;
}) {
  const { instanceKey, workspaceKey, projectKey } = useFlagbaseParams();

  const { data: instances } = useInstances();
  const { data: workspaces } = useWorkspaces();
  const { data: projects } = useProjects();
  const { data: environments } = useEnvironments();
  const { data: flags } = useFlags();
  const { data: activeEnvironmentKey } = useActiveEnvironment();

  return (
    <Dialog
      as="div"
      className="lg:hidden"
      open={mobileMenuOpen}
      onClose={setMobileMenuOpen}
    >
      <div className="fixed inset-0 z-10" />
      <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div className="flex items-center justify-between">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Flagbase</span>
            <img className="h-8 w-auto" src={Logo as string} alt="" />
          </Link>
          <button
            type="button"
            className="-m-2.5 rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="sr-only">Close menu</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-500/10">
            <div className="space-y-2 py-6">
              {instances && (
                <MobileDropdown
                  name="Instances"
                  description={instancesDescription}
                  href="/instances"
                >
                  {getInstanceDropdown(instances)}
                </MobileDropdown>
              )}
              {workspaces && instanceKey && (
                <MobileDropdown
                  name="Workspaces"
                  description={workspaceDescription}
                  href="/"
                >
                  {getWorkspaceDropdown(workspaces, instanceKey)}
                </MobileDropdown>
              )}
              {projects && workspaceKey && instanceKey && (
                <MobileDropdown
                  name="Projects"
                  description={projectsDescription}
                  href="/"
                >
                  {getProjectDropdown(projects, workspaceKey, instanceKey)}
                </MobileDropdown>
              )}
              {environments && instanceKey && workspaceKey && projectKey && (
                <MobileDropdown
                  name="Environments"
                  description={environmentsDescription}
                  href="/"
                >
                  {getEnvironmentDropdown(
                    environments,
                    instanceKey,
                    workspaceKey,
                    projectKey,
                  )}
                </MobileDropdown>
              )}
              {flags &&
                instanceKey &&
                workspaceKey &&
                activeEnvironmentKey &&
                projectKey && (
                  <MobileDropdown
                    name="Flags"
                    description={flagsDescription}
                    href="/"
                  >
                    {getFlagDropdown(
                      flags,
                      instanceKey,
                      workspaceKey,
                      activeEnvironmentKey,
                      projectKey,
                    )}
                  </MobileDropdown>
                )}
            </div>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}

export default MobileNavigation;
