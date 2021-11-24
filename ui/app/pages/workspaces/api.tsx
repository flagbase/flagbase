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
  console.log("wtf", result)
  return result.data.data
};
