import { useMutation, useQuery, useQueryClient } from 'react-query';

import { createVariation, fetchVariations, VariationCreateBody } from './api';
import { configureAxios } from '../../lib/axios';
import { useFlagbaseParams } from '../../lib/use-flagbase-params';
import { getVariationsKey } from '../../router/loaders';

export function useAddVariation() {
  const queryClient = useQueryClient();
  const { instanceKey, workspaceKey, projectKey, flagKey } =
    useFlagbaseParams();
  const mutation = useMutation({
    mutationFn: async (values: VariationCreateBody) => {
      if (!instanceKey || !workspaceKey || !projectKey || !flagKey) {
        throw new Error('Missing required params');
      }
      await createVariation({
        workspaceKey,
        projectKey,
        flagKey,
        variation: values,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getVariationsKey({
          instanceKey,
          workspaceKey,
          projectKey,
          flagKey,
        }),
      });
    },
  });

  return mutation;
}

export function useVariations() {
  const { instanceKey, workspaceKey, projectKey, flagKey } =
    useFlagbaseParams();

  const query = useQuery<Variation[]>(
    getVariationsKey({
      instanceKey,
      workspaceKey,
      projectKey,
      flagKey,
    }),
    {
      queryFn: async () => {
        if (!instanceKey || !workspaceKey || !projectKey || !flagKey) {
          throw new Error('Missing required params');
        }

        await configureAxios(instanceKey);

        return fetchVariations({
          workspaceKey: workspaceKey,
          projectKey: projectKey,
          flagKey: flagKey,
        });
      },
      enabled:
        Boolean(workspaceKey) &&
        Boolean(projectKey) &&
        Boolean(flagKey) &&
        Boolean(instanceKey),
      refetchOnWindowFocus: false,
      cacheTime: 10 * 1000,
      staleTime: 15 * 1000,
    },
  );

  return query;
}
