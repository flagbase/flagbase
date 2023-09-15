export interface AccessToken {
  expiresAt: Date;
  id: string;
  accessToken: string;
}

export interface AccessTokenResponse {
  access: {
    expiresAt: Date;
    id: string;
  };
  token: string;
}
