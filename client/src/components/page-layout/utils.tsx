import { Environment } from '../../pages/environments/environments';
import { Flag } from '../../pages/flags/api';
import { Instance } from '../../pages/instances/instances.functions';
import { Project } from '../../pages/projects/api';
import { Workspace } from '../../pages/workspaces/api';
import {
  getEnvironmentPath,
  getProjectPath,
  getWorkspacePath,
  getWorkspacesPath,
  getFlagPath,
} from '../../router/router.paths';

const instancesDescription = `An "instance" refers to a Flagbase core installation, running on a single VPS or clustered in a datacenter.`;
const workspaceDescription = `A workspace is the top-level resource which is used to group projects.`;
const projectsDescription = `A project is a collection of feature flags and settings. You can have multiple projects in a single workspace.`;
const environmentsDescription = `An environment is a set of feature flags and settings that can be applied to a specific set of users.`;
const flagsDescription = `A feature flag is a boolean value that determines whether a feature is enabled or disabled.`;

function getEnvironmentDropdown(
  data: Environment[],
  instanceKey: string,
  workspaceKey: string,
  projectKey: string,
) {
  return data.map((object) => {
    return {
      name: object.attributes.name,
      description: object.attributes.description,
      href: getEnvironmentPath(
        instanceKey,
        workspaceKey,
        projectKey,
        object.attributes.key,
      ),
    };
  });
}

function getProjectDropdown(
  data: Project[],
  workspaceKey: string,
  instanceKey: string,
) {
  return data.map((object) => {
    return {
      name: object.attributes.name,
      description: object.attributes.description,
      href: getProjectPath(instanceKey, workspaceKey, object.attributes.key),
    };
  });
}

const getWorkspaceDropdown = (data: Workspace[], instanceKey: string) => {
  return data.map((object) => {
    return {
      name: object.attributes.name,
      description: object.attributes.description,
      href: getWorkspacePath(instanceKey, object.attributes.key),
    };
  });
};
const getInstanceDropdown = (data: Instance[]) => {
  return (
    data.map((object) => {
      return {
        name: object.name,
        description: object.name,
        href: getWorkspacesPath(object.key),
      };
    }) || []
  );
};

function getFlagDropdown(
  flags: Flag[],
  instanceKey: string,
  workspaceKey: string,
  environmentKey: string,
  projectKey: string,
) {
  return flags.map((flag) => {
    return {
      name: flag.attributes.name,
      description: flag.attributes.description,
      href: getFlagPath(
        instanceKey,
        workspaceKey,
        projectKey,
        environmentKey,
        flag.attributes.key,
      ),
    };
  });
}

export {
  getEnvironmentDropdown,
  getFlagDropdown,
  getInstanceDropdown,
  getProjectDropdown,
  getWorkspaceDropdown,
  instancesDescription,
  workspaceDescription,
  projectsDescription,
  environmentsDescription,
  flagsDescription,
};
