export const getWorkspacesPath = (instanceKey: string) =>
  `/${instanceKey}/workspaces`;
export const getWorkspacePath = (instanceKey: string, workspaceKey: string) =>
  `/${instanceKey}/workspaces/${workspaceKey}/projects`;

export const getProjectsPath = (instanceKey: string, workspaceKey: string) =>
  `/${instanceKey}/workspaces/${workspaceKey}/projects`;

export const getProjectPath = (
  instanceKey: string,
  workspaceKey: string,
  projectKey: string,
) => `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/flags`;

export const getEnvironmentsPath = (
  instanceKey: string,
  workspaceKey: string,
  projectKey: string,
) =>
  `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/environments`;

export const getEnvironmentPath = (
  instanceKey: string,
  workspaceKey: string,
  projectKey: string,
  environmentKey: string,
) =>
  `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/environments/${environmentKey}/sdk-keys`;

export const getFlagPath = (
  instanceKey: string,
  workspaceKey: string,
  projectKey: string,
  environmentKey: string,
  flagKey: string,
) =>
  `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/flags/${flagKey}/environments/${environmentKey}`;

export const getFlagsPath = (
  instanceKey: string,
  workspaceKey: string,
  projectKey: string,
) => `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/flags`;

export const getVariationPath = ({
  instanceKey,
  workspaceKey,
  projectKey,
  flagKey,
  variationKey,
}: {
  instanceKey: string;
  workspaceKey: string;
  projectKey: string;
  flagKey: string;
  variationKey: string;
}) =>
  `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/flags/${flagKey}/variations/${variationKey}/settings`;
