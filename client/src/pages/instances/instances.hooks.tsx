import {
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';

import { Instance } from './instances.functions';
import { fetchAccessToken } from '../../lib/access-token';
import { axios } from '../../lib/axios';
import { getInstances } from '../../router/utils';

export const useUpdateInstance = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (instance: Instance & { newKey: string }) => {
      axios.defaults.baseURL = instance.connectionString;
      const result = await fetchAccessToken(
        axios,
        instance.accessKey,
        instance.accessSecret,
      );
      const currInstances = JSON.parse(
        localStorage.getItem('instances') || '[]',
      ) as Instance[];
      const filteredInstances = currInstances.filter(
        (i: Instance) => i.key !== instance.key,
      );

      localStorage.setItem(
        'instances',
        JSON.stringify([
          ...filteredInstances,
          { ...instance, key: instance.newKey },
        ]),
      );

      return { ...instance, expiresAt: result.expiresAt };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['instances']);
    },
  });

  return mutation;
};

export function useAddInstance() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (instance: Omit<Instance, 'expiresAt'>) => {
      axios.defaults.baseURL = instance.connectionString;
      const result = await fetchAccessToken(
        axios,
        instance.accessKey,
        instance.accessSecret,
      );
      const currInstances = JSON.parse(
        localStorage.getItem('instances') || '[]',
      ) as Instance[];
      localStorage.setItem(
        'instances',
        JSON.stringify([
          ...currInstances,
          {
            ...instance,
            expiresAt: result.expiresAt,
            id: result.id,
            accessToken: result.accessToken,
          },
        ]),
      );

      return { ...instance, expiresAt: result.expiresAt };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['instances']);
    },
  });

  return mutation;
}

export const useRemoveInstance = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (instance: Omit<Instance, 'expiresAt'>) => {
      const currInstances = JSON.parse(
        localStorage.getItem('instances') || '[]',
      ) as Instance[];
      const filteredInstances = currInstances.filter(
        (i: Instance) => i.key !== instance.key,
      );
      localStorage.setItem('instances', JSON.stringify(filteredInstances));

      return { ...instance };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['instances']);
    },
  });

  return mutation;
};

export const useInstance = (instanceKey: string | undefined) => {
  const { data: instances } = useInstances({
    refetchOnWindowFocus: false,
    enabled: !!instanceKey,
  });
  const instance = instanceKey
    ? instances?.find(
        (i) => i.key.toLocaleLowerCase() === instanceKey.toLocaleLowerCase(),
      )
    : null;

  return instance;
};

export const useInstances = (options?: UseQueryOptions<Instance[]>) => {
  // Define a query to fetch the instances object from the server
  const query = useQuery<Instance[]>(['instances'], getInstances, {
    ...options,
  });

  return query;
};
