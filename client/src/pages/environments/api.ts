import { axios } from "../../lib/axios";
import { UpdateBody } from "../workspaces/api";

export const fetchEnvironments = async (
  workspaceKey: string,
  projectsKey: string
) => {
  if (!workspaceKey || !projectsKey) {
    return Promise.reject("Missing workspaceKey or projectsKey");
  }
  const result = await axios.get(
    `/projects/${workspaceKey}/${projectsKey}/environments`
  );

  return result.data;
};

export const deleteEnvironment = async ({
  workspaceKey,
  projectKey,
  environmentKey,
}: {
  workspaceKey: string;
  projectKey: string;
  environmentKey: string;
}) => {
  return axios.delete(
    `/projects/${workspaceKey}/${projectKey}/environments/${environmentKey}`
  );
};

export const updateEnvironment = async ({
  workspaceKey,
  projectKey,
  environmentKey,
  body,
}: {
  workspaceKey: string;
  projectKey: string;
  environmentKey: string;
  body: UpdateBody[];
}) => {
  return axios.patch(
    `/projects/${workspaceKey}/${projectKey}/environments/${environmentKey}`,
    body
  );
};

export type EnvironmentCreateBody = {
  key: string;
  name: string;
  description: string;
  tags: string[];
};

type Environment = {
  type: "variation";
  id: string;
  attributes: {
    description: string;
    key: string;
    name: string;
    tags: string[];
  };
};

export const createEnvironment = async ({
  workspaceKey,
  projectKey,
  environment,
}: {
  workspaceKey: string;
  projectKey: string;
  environment: EnvironmentCreateBody;
}): Promise<Environment> => {
  const { data } = await axios.post(
    `/projects/${workspaceKey}/${projectKey}/environments`,
    environment
  );

  return data;
};
