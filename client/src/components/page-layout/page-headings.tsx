import React, { ReactNode, useEffect, useState } from 'react';

import { Outlet, useLocation, useParams } from 'react-router-dom';

import { CopyRow } from './copy-row';
import PageHeading from './page-heading';
import { useFlagbaseParams } from '../../lib/use-flagbase-params';
import { useActiveEnvironment } from '../../pages/environments/environment-dropdown';
import { useEnvironments } from '../../pages/environments/environments';
import { useFlags } from '../../pages/flags/flags.hooks';
import { useInstances } from '../../pages/instances/instances.hooks';
import { useProjects } from '../../pages/projects/projects.hooks';
import { useSDKs } from '../../pages/sdks/sdks';
import { useVariations } from '../../pages/variations/variations.hooks';
import { useWorkspaces } from '../../pages/workspaces/workspaces.hooks';

type PageHeadingType = {
  title: string;
  tabs?: { name: string; href: string }[];
  subtitle?: string | ReactNode;
  backHref?: string | null;
};

export function PageHeadings() {
  const { activeTab } = useParams<{ activeTab: string }>();
  const location = useLocation();

  const [pageHeading, setPageHeading] = useState<PageHeadingType>({
    title: '',
    tabs: [],
  });

  const {
    instanceKey,
    workspaceKey,
    projectKey,
    environmentKey,
    sdkKey,
    flagKey,
    variationKey,
  } = useFlagbaseParams();

  const { data: instances } = useInstances({
    select: (instances) =>
      instances.filter((instance) => instance.key === instanceKey),
  });
  const { data: workspaces } = useWorkspaces();
  const { data: projects } = useProjects();
  const { data: environments } = useEnvironments();
  const { data: flags } = useFlags();
  const { data: activeEnvironmentKey } = useActiveEnvironment();
  const { data: variations } = useVariations();
  const { data: sdks } = useSDKs();

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
  const activeVariation = variations?.find(
    (variation) => variation.attributes.key === variationKey,
  );
  const activeSDK = sdks?.find((sdk) => sdk.id === sdkKey);

  useEffect(() => {
    if (location.pathname.includes('instances')) {
      setPageHeading({
        title: 'Instances',
        subtitle: 'Manage your instances',
        tabs: [],
        backHref: null,
      });
    } else if (
      instanceKey &&
      workspaceKey &&
      projectKey &&
      flagKey &&
      variationKey
    ) {
      setPageHeading({
        title: activeVariation?.attributes.name || variationKey,
        subtitle: 'Variations',
        backHref: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/flags/${flagKey}/variations`,
        tabs: [
          {
            name: 'Settings',
            href: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/flags/${flagKey}/variations/${variationKey}/settings`,
          },
        ],
      });
    } else if (instanceKey && workspaceKey && projectKey && flagKey) {
      setPageHeading({
        title: activeFlag?.attributes.name || flagKey,
        subtitle: <CopyRow text={flagKey} />,
        backHref: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/flags`,
        tabs: [
          {
            name: 'Targeting',
            href: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/flags/${flagKey}/environments/${
              activeEnvironment?.attributes.key || environmentKey
            }`,
          },
          {
            name: 'Variations',
            href: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/flags/${flagKey}/variations`,
          },
          {
            name: 'Settings',
            href: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/flags/${flagKey}/settings`,
          },
        ],
      });
    } else if (
      instanceKey &&
      workspaceKey &&
      projectKey &&
      environmentKey &&
      sdkKey
    ) {
      setPageHeading({
        title: activeSDK?.attributes.name || 'SDK Settings',
        subtitle: 'SDK',
        backHref: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/environments/${environmentKey}/sdk-keys`,
        tabs: [
          {
            name: 'Settings',
            href: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/environments/${environmentKey}/sdk-keys/${sdkKey}`,
          },
        ],
      });
    } else if (instanceKey && workspaceKey && projectKey && environmentKey) {
      setPageHeading({
        title: environmentKey,
        subtitle: 'Environment',
        backHref: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/environments`,
        tabs: [
          {
            name: 'SDKs',
            href: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/environments/${environmentKey}/sdk-keys`,
          },
          {
            name: 'Settings',
            href: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/environments/${environmentKey}/settings`,
          },
        ],
      });
    } else if (instanceKey && workspaceKey && projectKey) {
      setPageHeading({
        title: activeProject?.attributes.name || projectKey,
        subtitle: 'Project',
        backHref: `/${instanceKey}/workspaces/${workspaceKey}/projects`,
        tabs: [
          {
            name: 'Flags',
            href: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/flags`,
          },
          {
            name: 'Environments',
            href: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/environments`,
          },
          {
            name: 'Settings',
            href: `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/settings`,
          },
        ],
      });
    } else if (instanceKey && workspaceKey) {
      setPageHeading({
        title: activeWorkspace?.attributes.name || workspaceKey,
        subtitle: 'Workspace',
        backHref: `/${instanceKey}/workspaces`,
        tabs: [
          {
            name: 'Projects',
            href: `/${instanceKey}/workspaces/${workspaceKey}/projects`,
          },
          {
            name: 'Settings',
            href: `/${instanceKey}/workspaces/${workspaceKey}/settings`,
          },
        ],
      });
    } else if (instanceKey) {
      setPageHeading({
        title: activeInstance?.name || instanceKey,
        subtitle: 'Instance',
        backHref: '/',
        tabs: [
          {
            name: 'Workspaces',
            href: `/${instanceKey}/workspaces`,
          },
          {
            name: 'Settings',
            href: `/${instanceKey}/workspaces/settings`,
          },
        ],
      });
    }
  }, [location.pathname, activeTab, activeEnvironment]);

  useEffect(() => {
    if (pageHeading?.title) {
      document.title = `${pageHeading?.title} | Flagbase`;
    }
  }, [pageHeading]);

  return (
    <>
      <PageHeading
        title={pageHeading.title}
        subtitle={pageHeading.subtitle}
        tabs={pageHeading.tabs}
        backHref={pageHeading.backHref}
      />
      <div className="mx-auto max-w-7xl pt-8 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </>
  );
}
