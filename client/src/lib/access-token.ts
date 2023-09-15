import { AxiosInstance } from 'axios';

import { AccessToken, AccessTokenResponse } from './types';

export const fetchAccessToken = async (
  axios: AxiosInstance,
  key: string,
  secret: string,
): Promise<AccessToken> => {
  const result = await axios.post<AccessTokenResponse>(`/access/token`, {
    key,
    secret,
  });

  return {
    expiresAt: result.data.access.expiresAt,
    id: result.data.access.id,
    accessToken: result.data.token,
  };
};
