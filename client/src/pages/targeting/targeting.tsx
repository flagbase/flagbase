/* eslint-disable react/prop-types */
import React, { Suspense, useEffect, useState } from 'react';

import { Button, Loader, classNames } from '@flagbase/ui';
import { Switch } from '@headlessui/react';
import { ArrowPathIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { Form, Formik } from 'formik';
import { Await, useLoaderData } from 'react-router-dom';

import { TargetingRequest } from './api';
import CodeUsageModal from './code-usage-modal';
import RolloutSlider from './rollout-slider';
import { TargetingRules } from './targeting-rules';
import {
  useTargeting,
  useTargetingRules,
  useAddTargetingRule,
  useUpdateTargeting,
  newRuleFactory,
} from './targeting.hooks';
import { isValidVariationSum } from './targeting.utils';
import { useFlagbaseParams } from '../../lib/use-flagbase-params';
import { useVariations } from '../variations/variations.hooks';

type VariationResponse = {
  type: 'variation';
  id: string;
  attributes: {
    description: string;
    key: string;
    name: string;
    tags: string[];
  };
};

export const Targeting = () => {
  const { variations: initialVariations } = useLoaderData();
  const { targeting: initialTargeting } = useLoaderData();
  const { environmentKey } = useFlagbaseParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const targetingQuery = useTargeting();
  const targetingRulesQuery = useTargetingRules();
  const variationsQuery = useVariations();

  const addTargetingRuleMutation = useAddTargetingRule();
  const updateTargetingMutation = useUpdateTargeting();

  const { refetch: refetchTargeting } = targetingQuery;
  const { refetch: refetchTargetingRules } = targetingRulesQuery;
  useEffect(() => {
    refetchTargeting();
    refetchTargetingRules();
  }, [environmentKey, refetchTargeting, refetchTargetingRules]);

  const createRule = async (variations: VariationResponse[]) => {
    const newRule = newRuleFactory(variations);
    addTargetingRuleMutation.mutate(newRule);
  };

  const updateTargeting = async (
    currentValues: TargetingRequest,
    newValues: TargetingRequest,
  ) => {
    updateTargetingMutation.mutate({
      rule: currentValues,
      newRule: newValues,
    });
  };

  return (
    <Suspense fallback={<Loader />}>
      <Await resolve={initialVariations}>
        <Await resolve={initialTargeting}>
          {() => (
            <>
              <div>
                {targetingQuery.isSuccess && (
                  <Formik
                    initialValues={targetingQuery.data.attributes}
                    enableReinitialize={true}
                    onSubmit={async (values) => {
                      setIsLoading(true);
                      await updateTargeting(
                        targetingQuery.data.attributes,
                        values,
                      );
                      setTimeout(() => setIsLoading(false), 2000);
                    }}
                  >
                    {({ values, setFieldValue }) => (
                      <Form>
                        <div className="w-100 mb-4 items-center gap-5">
                          <div className="flex flex-wrap justify-between gap-4">
                            <div>
                              <div className="space-between flex flex-row">
                                <Switch.Group
                                  as="div"
                                  className="mr-3 flex items-center"
                                >
                                  <Switch
                                    name="enabled"
                                    disabled={updateTargetingMutation.isLoading}
                                    checked={values?.enabled}
                                    onChange={async (checked: boolean) => {
                                      await updateTargeting(
                                        targetingQuery.data.attributes,
                                        {
                                          ...values,
                                          enabled: checked,
                                        },
                                      );

                                      return setFieldValue('enabled', checked);
                                    }}
                                    className={classNames(
                                      values.enabled
                                        ? 'bg-indigo-600'
                                        : 'bg-gray-200',
                                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200',
                                      'ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
                                      'disabled:opacity-50 disabled:cursor-not-allowed',
                                    )}
                                  >
                                    <span
                                      aria-hidden="true"
                                      className={classNames(
                                        values?.enabled
                                          ? 'translate-x-5'
                                          : 'translate-x-0',
                                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                                      )}
                                    />
                                  </Switch>
                                </Switch.Group>
                                <h1 className=" text-xl font-semibold leading-6 text-gray-900">
                                  {values.enabled ? 'Enabled' : 'Disabled'}
                                </h1>
                              </div>
                              <p className="mt-2 max-w-4xl text-sm text-gray-500">
                                {values.enabled
                                  ? 'Users will evaluate the targeting rules below. If none of them match, users will be served the fallthrough variations.'
                                  : 'Users will evaluate the fallthrough variations.'}
                              </p>
                            </div>
                            <CodeUsageModal />
                          </div>
                        </div>
                        <div>
                          <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                            <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                              <div className="ml-4 mt-2">
                                <h3 className="text-base font-semibold leading-6 text-gray-900">
                                  Fallthrough
                                </h3>
                              </div>
                            </div>
                          </div>
                          <div className="overflow-hidden bg-white shadow sm:rounded-md">
                            <div className="block p-4 hover:bg-gray-50 sm:px-6">
                              {values.fallthroughVariations.length > 0 && (
                                <RolloutSlider
                                  data={values.fallthroughVariations}
                                  maxValue={100}
                                  onChange={(data) => {
                                    data.forEach((varation, i) =>
                                      setFieldValue(
                                        `fallthroughVariations.${i}.weight`,
                                        varation.weight,
                                      ),
                                    );
                                  }}
                                />
                              )}
                              <Button
                                isLoading={isLoading}
                                disabled={
                                  !isValidVariationSum(
                                    values.fallthroughVariations,
                                  )
                                }
                                className={`mr-3 mt-3 justify-center py-2 ${
                                  !isValidVariationSum(
                                    values?.fallthroughVariations,
                                  )
                                    ? 'bg-indigo-50 hover:bg-indigo-50'
                                    : 'bg-indigo-600'
                                }`}
                                suffix={ArrowPathIcon}
                                type="submit"
                              >
                                Update
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                )}
              </div>
              {targetingQuery.isSuccess && variationsQuery.isSuccess && (
                <div
                  className={
                    targetingQuery.data.attributes.enabled
                      ? 'mb-10'
                      : 'pointer-events-none mb-10 blur-sm'
                  }
                >
                  <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                    <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                      <div className="ml-4 mt-2">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">
                          Rules
                        </h3>
                      </div>
                      <div className="ml-4 mt-2 shrink-0">
                        <Button
                          className="mt-3 justify-center py-2 text-indigo-600"
                          type="submit"
                          suffix={PlusCircleIcon}
                          onClick={async () =>
                            await createRule(variationsQuery.data)
                          }
                          variant="secondary"
                          isLoading={addTargetingRuleMutation.isLoading}
                        >
                          New Rule
                        </Button>
                      </div>
                    </div>
                  </div>
                  <TargetingRules />
                </div>
              )}
            </>
          )}
        </Await>
      </Await>
    </Suspense>
  );
};
