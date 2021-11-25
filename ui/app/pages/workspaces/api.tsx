import axios from "axios";

interface AccessToken {
  expiresAt: number;
  token: string;
}

export const fetchAccessToken = async (
  url: string,
  key: string,
  secret: string
): Promise<AccessToken> => {
  console.log("WHAT", url, key, secret)
  const result = await axios.post(`${url}/access/token`, {
    key,
    secret,
  });
  return {
    expiresAt: result.data.data.access.expiresAt,
    token: result.data.data.token,
  };
};

export const listWorkspaces = async (url: string, accessToken: string) => {
  const result = await axios.get(`${url}/workspaces`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return result.data.data;
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
