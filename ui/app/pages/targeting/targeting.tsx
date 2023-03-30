/* eslint-disable react/prop-types */
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { Form, Formik } from 'formik'
import React, { Suspense, useEffect, useState } from 'react'
import { Await, useLoaderData, useRevalidator } from 'react-router-dom'
import Button from '../../../components/button/button'
import { Loader } from '../../../components/loader'
import { Switch } from '@headlessui/react'
import { classNames } from '../../../helpers'
import {
    TargetingResponse,
    TargetingRuleResponse,
    Operator,
    createTargetingRule,
    patchTargeting,
    TargetingRequest,
} from './api'
import { useFlagbaseParams } from '../../lib/use-flagbase-params'
import { isValidVariationSum, objectsEqual } from './targeting.utils'
import TargetingRule from './targeting-rule'
import RolloutSlider from '../../../components/rollout-slider'
import EmptyState from '../../../components/empty-state'
import CodeUsageModal from '../../../components/code-usage-modal'
import { useQuery } from 'react-query'
import { getTargetingKey, getTargetingRulesKey } from '../../router/loaders'
import { configureAxios } from '../../lib/axios'
import { fetchTargeting, fetchTargetingRules } from '../flags/api'
import { useVariations } from '../variations/variations'

type VariationResponse = {
    type: 'variation'
    id: string
    attributes: {
        description: string
        key: string
        name: string
        tags: string[]
    }
}

const newRuleFactory = (variations: VariationResponse[]) => ({
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
})

export const useTargeting = () => {
    const { instanceKey, workspaceKey, projectKey, environmentKey, flagKey } = useFlagbaseParams()
    const query = useQuery<TargetingResponse>(
        getTargetingKey({ workspaceKey, projectKey, environmentKey, flagKey }),
        {
            queryFn: async () => {
                await configureAxios(instanceKey!)
                return fetchTargeting({ workspaceKey, projectKey, environmentKey, flagKey })
            },
            enabled: !!instanceKey && !!workspaceKey,
        }
    )
    return query
}

export const useTargetingRules = () => {
    const { instanceKey, workspaceKey, projectKey, environmentKey, flagKey } = useFlagbaseParams()
    const query = useQuery<TargetingRuleResponse[]>(
        getTargetingRulesKey({ workspaceKey, projectKey, environmentKey, flagKey }),
        {
            queryFn: async () => {
                await configureAxios(instanceKey!)
                return fetchTargetingRules({ workspaceKey, projectKey, environmentKey, flagKey })
            },
            enabled: !!instanceKey && !!workspaceKey,
        }
    )
    return query
}


export const Targeting = () => {
    const { workspaceKey, projectKey, environmentKey, flagKey } = useFlagbaseParams()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLoadingNewRule, setIsLoadingNewRule] = useState<boolean>(false)

    const { data: targeting, isLoading: isTargetingLoading, refetch: refetchTargeting } = useTargeting();
    const { data: targetingRules, isLoading: isTargetingRulesLoading, refetch: refetchTargetingRules } = useTargetingRules();
    const { data: variations, isLoading: isVariationsLoading } = useVariations();

    useEffect(() => {
        refetchTargeting();
        refetchTargetingRules();
    }, [environmentKey, refetchTargeting, refetchTargetingRules])

    const revalidator = useRevalidator();

    const createRule = async (variations: VariationResponse[]) => {
        setIsLoadingNewRule(true)
        const newRule = newRuleFactory(variations)
        await createTargetingRule({ workspaceKey, projectKey, environmentKey, flagKey }, newRule)
        setTimeout(() => setIsLoadingNewRule(false), 2000)
        revalidator.revalidate()
    }
    
    const updateTargeting = async (currentValues: TargetingRequest, newValues: TargetingRequest) => {
        const shouldUpdate = !objectsEqual(newValues, currentValues)
        if (shouldUpdate) {
            patchTargeting({ workspaceKey, projectKey, environmentKey, flagKey }, currentValues, newValues)
            revalidator.revalidate()
        }
    }

    return !isTargetingLoading && targeting && variations && (
                        <>
                            <div>
                                <Formik
                                    initialValues={{ ...targeting.attributes }}
                                    enableReinitialize={true}
                                    onSubmit={async (values) => {
                                        setIsLoading(true)
                                        await updateTargeting(targeting.attributes, values)
                                        setTimeout(() => setIsLoading(false), 2000)
                                    }}
                                >
                                    {({ values, setFieldValue }) => (
                                        <Form>
                                            <div className="mb-4 gap-5 items-center w-100">
                                                <div className="flex">
                                                    <div className="flex-auto w-95">
                                                        <div className="flex flex-row space-between">
                                                        <Switch.Group as="div" className="flex items-center mr-3">
                                                            <Switch
                                                                name="enabled"
                                                                checked={values?.enabled}
                                                                onChange={async (checked: boolean) => {
                                                                    await updateTargeting(targeting.attributes, {
                                                                        ...values,
                                                                        enabled: checked,
                                                                    })
                                                                    return setFieldValue('enabled', checked)
                                                                }}
                                                                className={classNames(
                                                                    values?.enabled ? 'bg-indigo-600' : 'bg-gray-200',
                                                                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
                                                                )}
                                                            >
                                                                <span
                                                                    aria-hidden="true"
                                                                    className={classNames(
                                                                        values?.enabled
                                                                            ? 'translate-x-5'
                                                                            : 'translate-x-0',
                                                                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                                                    )}
                                                                />
                                                            </Switch>
                                                        </Switch.Group>
                                                        <h1 className="text-base font-semibold leading-6 text-gray-900 text-xl">
                                                            {targeting?.attributes?.enabled ? 'Enabled' : 'Disabled'}
                                                        </h1>
                                                        </div>
                                                        <p className="mt-2 max-w-4xl text-sm text-gray-500">
                                                            {targeting?.attributes?.enabled
                                                                ? 'Users will evaluate the targeting rules below. If none of them match, users will be served the fallthrough variations.'
                                                                : 'Users will evaluate the fallthrough variations.'}
                                                        </p>
                                                    </div>
                                                    <div className="flex-auto w-5">
                                                        <CodeUsageModal />
                                                    </div>
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
                                                    <div className="block hover:bg-gray-50 px-4 py-4 sm:px-6">
                                                <code className="text-xl font-bold uppercase">Serve</code>
                                                        {targeting.attributes.fallthroughVariations && (
                                                            <RolloutSlider
                                                                data={values.fallthroughVariations}
                                                                onChange={(data) => {
                                                                    data.forEach((varation, i) =>
                                                                        setFieldValue(
                                                                            `fallthroughVariations.${i}.weight`,
                                                                            varation.weight
                                                                        )
                                                                    )
                                                                }}
                                                            />
                                                        )}
                                                        <Button
                                                            isLoading={isLoading}
                                                            disabled={
                                                                !isValidVariationSum(values?.fallthroughVariations)
                                                            }
                                                            className={`mt-3 mr-3 py-1 justify-center ${
                                                                !isValidVariationSum(values?.fallthroughVariations)
                                                                    ? 'bg-indigo-50 hover:bg-indigo-50'
                                                                    : 'bg-indigo-600'
                                                            }`}
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
                            </div>
                            <div className={!targeting.attributes.enabled ? 'blur-sm mb-10' : 'mb-10'}>
                                <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                                    <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                                        <div className="ml-4 mt-2">
                                            <h3 className="text-base font-semibold leading-6 text-gray-900">Rules</h3>
                                        </div>
                                        <div className="ml-4 mt-2 flex-shrink-0">
                                            <Button
                                                className="mt-3 py-2 justify-center text-indigo-600"
                                                type="submit"
                                                suffix={PlusCircleIcon}
                                                onClick={async () => await createRule(variations)}
                                                secondary
                                                isLoading={isLoadingNewRule}
                                            >
                                                New Rule
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="overflow-hidden bg-white shadow sm:rounded-md">
                                    {targetingRules?.length ? (
                                        <ul role="list" className="divide-y divide-gray-200">
                                            {targetingRules?.reverse().map((rule) => (
                                                <li key={rule.key}>
                                                    <div className="block hover:bg-gray-50">
                                                        <div className="px-4 py-4 sm:px-6">
                                                            <TargetingRule rule={rule.attributes} />
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="m-10">
                                            <EmptyState
                                                title="No rules"
                                                description="This flag has no targeting rules yet."
                                                cta={
                                                    <Button
                                                        className="py-2"
                                                        type="submit"
                                                        onClick={async () =>
                                                            await createRule(variations)
                                                        }
                                                        suffix={PlusCircleIcon}
                                                    >
                                                        Create a rule
                                                    </Button>
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )
}
