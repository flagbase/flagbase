import { axios } from '../../lib/axios';

export interface Workspace {
  type: string;
  id: string;
  attributes: {
    description: string;
    key: string;
    name: string;
    tags: string[];
  };
}

export const fetchWorkspaces = async () => {
  const result = await axios.get<Workspace[]>(`/workspaces`);

  return result.data;
};

export type UpdateBody = {
  op: 'replace';
  path: string;
  value: string;
};

export const updateWorkspace = async ({
  workspaceKey,
  body,
}: {
  workspaceKey: string;
  body: UpdateBody[];
}) => {
  return axios.patch(`/workspaces/${workspaceKey}`, body);
};

export const deleteWorkspace = async (workspaceKey: string) => {
  return axios.delete(`/workspaces/${workspaceKey}`);
};

export const createWorkspace = async ({
  name,
  description,
  tags,
}: {
  name: string;
  description: string;
  tags: string[];
}) => {
  return axios.post(`/workspaces`, {
    key: name.toLowerCase().replace(' ', '-'),
    name,
    description,
    tags,
  });
};
