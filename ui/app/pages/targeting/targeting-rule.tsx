/* eslint-disable react/prop-types */
import React from 'react';

import { ArrowPathIcon, MinusCircleIcon } from '@heroicons/react/24/outline';
import { Form, Formik } from 'formik';
import { useMutation, useQueryClient } from 'react-query';

import {
  TargetingRuleRequest,
  deleteTargetingRule,
  updateTargetingRule,
} from './api';
import { isValidVariationSum, objectsEqual } from './targeting.utils';
import Button from '../../../components/button/button';
import Input from '../../../components/input/input';
import { Select } from '../../../components/input/select';
import { TagInput } from '../../../components/input/tag-input';
import { Toggle } from '../../../components/input/toggle';
import RolloutSlider from '../../../components/rollout-slider';
import { useNotification } from '../../hooks/use-notification';
import { useFlagbaseParams } from '../../lib/use-flagbase-params';
import { getTargetingRulesKey } from '../../router/loaders';

const options = [
  { name: 'Equal', value: 'equal' },
  { name: 'Greater Than', value: 'greater_than' },
  { name: 'Greater Than or Equal', value: 'greater_than_or_equal' },
  { name: 'Contains', value: 'contains' },
  { name: 'Regex', value: 'regex' },
];

function getNameFromValue(value: string): string | undefined {
  const option = options.find((option) => option.value === value);

  return option ? option.name : undefined;
}

export const useUpdateTargetingRule = () => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  const { workspaceKey, projectKey, environmentKey, flagKey } =
    useFlagbaseParams();
  const mutation = useMutation({
    mutationFn: async ({
      newRule,
      rule,
    }: {
      newRule: TargetingRuleRequest;
      rule: TargetingRuleRequest;
    }) => {
      const shouldUpdate = !objectsEqual(newRule, rule);
      if (shouldUpdate) {
        await updateTargetingRule(
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
        queryKey: getTargetingRulesKey({
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
  });

  return mutation;
};

export const useDeleteTargetingRule = () => {
  const queryClient = useQueryClient();
  const notification = useNotification();
  const { workspaceKey, projectKey, environmentKey, flagKey } =
    useFlagbaseParams();
  const mutation = useMutation({
    mutationFn: async (ruleKey: string) => {
      await deleteTargetingRule({
        workspaceKey,
        projectKey,
        environmentKey,
        flagKey,
        ruleKey,
      });
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
      notification.addNotification({
        type: 'success',
        title: 'Success',
        content: 'Targeting rule deleted',
      });
    },
  });

  return mutation;
};

const TargetingRule = ({ rule }: { rule: TargetingRuleRequest }) => {
  const deleteTargetingRuleMutation = useDeleteTargetingRule();
  const updateTargetingRuleMutation = useUpdateTargetingRule();

  const { isLoading: deleteLoading } = deleteTargetingRuleMutation;
  const { isLoading: updateLoading } = updateTargetingRuleMutation;

  return (
    <Formik
      initialValues={{ ...rule }}
      onSubmit={(newRule) =>
        updateTargetingRuleMutation.mutate({ newRule, rule })
      }
    >
      {({ values, setFieldValue }) => (
        <Form>
          <div className="flex">
            <div className="flex-auto w-80">
              <div className="flex gap-3 items-center mb-4">
                <code className="text-xl font-bold uppercase">if</code>
                <Input name="traitKey" label="Trait Key" />
                <Select
                  options={options}
                  onChange={(operator: string) => {
                    setFieldValue('operator', operator);
                  }}
                  name="operator"
                  label="Operator"
                  value={{
                    value: values.operator,
                    name: getNameFromValue(values.operator),
                  }}
                />
                <Input name="traitValue" label="Trait Value" />
              </div>
              <div className="flex gap-5 items-center mb-4">
                <Toggle type="checkbox" name="negate" label="Negate" />
              </div>
              <div className="flex gap-5 items-center">
                <code className="text-xl font-bold uppercase">Then Serve</code>
              </div>
              <RolloutSlider
                data={rule?.ruleVariations}
                onChange={(data) => {
                  data.forEach((varation, i) => {
                    setFieldValue(
                      `ruleVariations.${i}.weight`,
                      varation.weight,
                    );
                  });
                }}
              />
            </div>
            <div className="flex-auto w-20 pl-5 gap-3">
              <Input name="key" label="Rule Key" />
              <Input name="name" label="Name" />
              <Input name="description" label="Description" />
              <TagInput name="tags" label="Tags" />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              disabled={
                objectsEqual(values, rule) ||
                !isValidVariationSum(values.ruleVariations)
              }
              className={`py-2 justify-center ${
                objectsEqual(values, rule) ||
                !isValidVariationSum(values.ruleVariations)
                  ? 'bg-indigo-50 hover:bg-indigo-50'
                  : 'bg-indigo-600'
              }`}
              type="submit"
              isLoading={updateLoading}
              suffix={ArrowPathIcon}
            >
              Update
            </Button>
            <Button
              variant="secondary"
              className="py-2"
              onClick={() => deleteTargetingRuleMutation.mutate(rule.key)}
              isLoading={deleteLoading}
              suffix={MinusCircleIcon}
            >
              Delete
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TargetingRule;
