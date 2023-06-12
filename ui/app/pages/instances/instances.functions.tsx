export type APIInstance = {
  accessKey: string;
  accessSecret: string;
  accessToken: string;
  connectionString: string;
  expiresAt: string;
  id: string;
  key: string;
  name: string;
};

export type Instance = {
  name: string;
  connectionString: string;
  credentials: {
    accessKey: string;
    accessSecret: string;
    accessToken: string;
  }[];
};
