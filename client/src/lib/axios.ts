import Axios, { AxiosError, AxiosResponse } from 'axios';

import { fetchAccessToken } from './access-token';
import { Instance } from '../pages/instances/instances.functions';
import queryClient from '../router/query-client';
import { getInstances } from '../router/utils';

export const axios = Axios.create();

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError<{ message: string }>) => {
    const message = error.response?.data?.message || error.message;

    return Promise.reject({
      message,
      status: error.response?.status || 404,
    });
  },
);
axios.defaults.baseURL = 'http://localhost:3000/';

const getCachedAccessToken = async (
  connectionString: string,
  accessKey: string,
  accessSecret: string,
) => {
  const hashKey = `${connectionString}-${accessKey}-${accessSecret}`;
  const cachedAccessToken = sessionStorage.getItem(hashKey);
  if (cachedAccessToken) {
    return {
      accessToken: cachedAccessToken,
    };
  } else {
    const { accessToken } = await fetchAccessToken(
      axios,
      accessKey,
      accessSecret,
    );
    sessionStorage.setItem(hashKey, accessToken);

    return { accessToken };
  }
};

export const configureAxios = async (instanceKey: string) => {
  const instances = await queryClient.fetchQuery<Instance[]>({
    queryKey: ['instances'],
    queryFn: () => getInstances(),
  });
  const instance = instances?.find(
    (instance: Instance) =>
      instance.key.toLocaleLowerCase() === instanceKey.toLocaleLowerCase(),
  );
  if (!instance) {
    return Promise.reject({
      message: `Instance ${instanceKey} not found`,
      status: 404,
    });
  }

  axios.defaults.baseURL = instance?.connectionString;
  const { accessToken } = await getCachedAccessToken(
    instance.connectionString,
    instance.accessKey,
    instance.accessSecret,
  );
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
};
