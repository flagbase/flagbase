/* eslint-disable react/prop-types */
import React from 'react';

import { Button, Input, Select, useNotification } from '@flagbase/ui';
import { ArrowPathIcon, MinusCircleIcon } from '@heroicons/react/24/outline';
import { Field, Form, Formik } from 'formik';
import { useMutation, useQueryClient } from 'react-query';

import {
  TargetingRuleRequest,
  deleteTargetingRule,
  updateTargetingRule,
} from './api';
import RolloutSlider from './rollout-slider';
import { isValidVariationSum, objectsEqual } from './targeting.utils';
import { TagInput } from '../../components/molecules/form/tag-input';
import Toggle from '../../components/molecules/form/toggle/toggle';
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
            <div className="flex w-3/5 flex-col">
              <div className="mb-4 flex items-center gap-3">
                <code className="text-xl font-bold uppercase">if</code>
                <Field as={Input} name="traitKey" label="Trait Key" />
                <Select
                  options={options}
                  onChange={({ value }: { value: string }) => {
                    setFieldValue('operator', value);
                  }}
                  name="operator"
                  value={{
                    name: getNameFromValue(values.operator),
                    value: values.operator,
                  }}
                />
                <Field as={Input} name="traitValue" label="Trait Value" />
              </div>
              <div className="mb-4 flex items-center gap-5">
                <Toggle type="checkbox" name="negate" label="Negate" />
              </div>
              <div className="flex items-center gap-5">
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
            <div className="flex w-2/5 flex-col gap-4 pl-5">
              <Field as={Input} name="key" label="Rule Key" />
              <Field as={Input} name="name" label="Name" />
              <Field as={Input} name="description" label="Description" />
              <Field as={TagInput} name="tags" label="Tags" />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              disabled={
                objectsEqual(values, rule) ||
                !isValidVariationSum(values.ruleVariations)
              }
              className={`justify-center py-2 ${
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
