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

export interface Project {
  type: string;
  id: string;
  attributes: {
    description: string;
    key: string;
    name: string;
    tags: string[]
  }
}

export interface ProjectResponse {
  data: Project[]
  
}

export const fetchProjects = async (url: string, workspaceKey:string, accessToken: string) => {
  const result = await axios.get<ProjectResponse>(`${url}/projects/${workspaceKey}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return result.data.data
};

export const deleteProject = async (
  url: string,
  ProjectKey: string,
  accessToken: string
) => {
  return axios.delete(`${url}/Projects/${ProjectKey}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE"
    },
  });
};

export const createProject = async (
  url: string,
  name: string,
  description: string,
  tags: string[],
  accessToken: string,
  workspaceKey: string,
) => {
  return axios.post(`${url}/projects/${workspaceKey}`, {
      key: name.toLowerCase().replace(' ', '-'),
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
