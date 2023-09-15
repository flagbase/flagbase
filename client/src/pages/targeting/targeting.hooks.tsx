/* eslint-disable react/prop-types */

import { useNotification } from '@flagbase/ui';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  TargetingResponse,
  TargetingRuleResponse,
  Operator,
  createTargetingRule,
  patchTargeting,
  TargetingRequest,
  TargetingRuleRequest,
} from './api';
import { objectsEqual } from './targeting.utils';
import { configureAxios } from '../../lib/axios';
import { useFlagbaseParams } from '../../lib/use-flagbase-params';
import { getTargetingKey, getTargetingRulesKey } from '../../router/loaders';
import { fetchTargeting, fetchTargetingRules } from '../flags/api';

export const newRuleFactory = (variations: VariationResponse[]) => ({
  key: `some-rule-key-${window.crypto.randomUUID().split('-').pop()}`,
  name: `My targeting rule`,
  description: 'Some rule description',
  tags: ['default'],
  type: 'trait',
  traitKey: 'Key',
  traitValue: 'Value',
  operator: 'equal' as Operator,
  ruleVariations: variations.map((variation) => ({
    variationKey: variation.attributes.key,
    weight: Math.round(100 / variations.length),
  })),
});

export const useUpdateTargeting = () => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  const { workspaceKey, projectKey, environmentKey, flagKey } =
    useFlagbaseParams();
  const mutation = useMutation({
    mutationFn: async ({
      newRule,
      rule,
    }: {
      newRule: TargetingRequest;
      rule: TargetingRequest;
    }) => {
      const shouldUpdate = !objectsEqual(newRule, rule);
      if (shouldUpdate) {
        await patchTargeting(
          {
            workspaceKey,
            projectKey,
            environmentKey,
            flagKey,
            ruleKey: rule.key,
          },
          rule,
          newRule,
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getTargetingKey({
          workspaceKey,
          projectKey,
          environmentKey,
          flagKey,
        }),
      });
      notification.addNotification({
        type: 'success',
        title: 'Success',
        content: 'Targeting rule updated',
      });
    },
    onError: () => {
      notification.addNotification({
        type: 'error',
        title: 'Error',
        content: 'Failed to update targeting rule',
      });
    },
  });

  return mutation;
};

export const useTargeting = () => {
  const { instanceKey, workspaceKey, projectKey, environmentKey, flagKey } =
    useFlagbaseParams();
  const query = useQuery<TargetingResponse>(
    getTargetingKey({ workspaceKey, projectKey, environmentKey, flagKey }),
    {
      queryFn: async () => {
        await configureAxios(instanceKey!);

        return fetchTargeting({
          workspaceKey,
          projectKey,
          environmentKey,
          flagKey,
        });
      },
      enabled: !!instanceKey && !!workspaceKey,
    },
  );

  return query;
};

export const useAddTargetingRule = () => {
  const queryClient = useQueryClient();
  const { workspaceKey, projectKey, environmentKey, flagKey } =
    useFlagbaseParams();
  const mutation = useMutation({
    mutationFn: async (newRule: TargetingRuleRequest) => {
      await createTargetingRule(
        { workspaceKey, projectKey, environmentKey, flagKey },
        newRule,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getTargetingRulesKey({
          workspaceKey,
          projectKey,
          environmentKey,
          flagKey,
        }),
      });
    },
  });

  return mutation;
};

export const useTargetingRules = () => {
  const { instanceKey, workspaceKey, projectKey, environmentKey, flagKey } =
    useFlagbaseParams();
  const query = useQuery<TargetingRuleResponse[]>(
    getTargetingRulesKey({
      workspaceKey,
      projectKey,
      environmentKey,
      flagKey,
    }),
    {
      queryFn: async () => {
        await configureAxios(instanceKey!);

        return fetchTargetingRules({
          workspaceKey,
          projectKey,
          environmentKey,
          flagKey,
        });
      },
      enabled: !!instanceKey && !!workspaceKey,
      refetchOnWindowFocus: false,
    },
  );

  return query;
};
