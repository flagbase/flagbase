import axios, { AxiosResponse } from "axios";
import { v4 as uuidv4 } from "uuid";

interface AccessToken {
  expiresAt: number;
  token: string;
}

export const fetchAccessToken = async (
  url: string,
  key: string,
  secret: string
): Promise<AccessToken> => {
  const result = await axios.post(`${url}/access/token`, {
    key,
    secret,
  });
  return {
    expiresAt: result.data.data.access.expiresAt,
    token: result.data.data.token,
  };
};

export interface Workspace {
  type: string;
  id: string;
  attributes: {
    description: string;
    key: string;
    name: string;
    tags: string[]
  }
}

export interface WorkspaceResponse {
  data: Workspace[]
  
}

export const fetchWorkspaces = async (url: string, accessToken: string) => {
  const result = await axios.get<WorkspaceResponse>(`${url}/workspaces`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return result.data.data
};

export const deleteWorkspace = async (
  url: string,
  workspaceKey: string,
  accessToken: string
) => {
  return axios.delete(`${url}/workspaces/${workspaceKey}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE"
    },
  });
};

export const createWorkspace = async (
  url: string,
  name: string,
  description: string,
  tags: string[],
  accessToken: string
) => {
  return axios.post(`${url}/workspaces`, {
      key: uuidv4().substring(0, 30),
      name,
      description,
      tags
  }, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE"
    }
  });
};
