/* eslint-disable react/prop-types */
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { Field, Form, Formik } from 'formik'
import React, { Suspense } from 'react'
import { Await, useLoaderData, useRevalidator } from 'react-router-dom'
import Button from '../../../components/button/button'
import Input from '../../../components/input/input'
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

const newRuleFactory = (variations: VariationResponse[], targetingRules: TargetingRuleResponse[]) => ({
    key: `some-rule-key-${window.crypto.randomUUID().split('-').pop()}`,
    name: `Some rule name ${targetingRules.length + 1}`,
    description: 'Some rule description',
    tags: ['default'],
    type: 'trait',
    traitKey: 'Key',
    traitValue: 'Value',
    operator: 'equal' as Operator,
    ruleVariations: [
        {
            variationKey: variations[0].attributes.key,
            weight: 100,
        },
        ...(variations.length > 1
            ? variations.slice(1).map((variation) => ({ variationKey: variation.attributes.key, weight: 0 }))
            : []),
    ],
})

export const Targeting = () => {
    const { workspaceKey, projectKey, environmentKey, flagKey } = useFlagbaseParams()

    const { targetingRules, targeting, variations } = useLoaderData() as {
        targetingRules: TargetingRuleResponse[]
        targeting: TargetingResponse
        variations: VariationResponse[]
    }
    const revalidator = useRevalidator()

    const createRule = async (variations: VariationResponse[], targetingRules: TargetingRuleResponse[]) => {
        const newRule = newRuleFactory(variations, targetingRules)
        await createTargetingRule({ workspaceKey, projectKey, environmentKey, flagKey }, newRule)
        revalidator.revalidate()
    }

    const updateTargeting = async (currentValues: TargetingRequest, newValues: TargetingRequest) => {
        const shouldUpdate = !objectsEqual(newValues, currentValues)
        if (shouldUpdate) {
            patchTargeting({ workspaceKey, projectKey, environmentKey, flagKey }, currentValues, newValues)
            revalidator.revalidate()
        }
    }

    return (
        <Suspense fallback={<Loader />}>
            <Await resolve={Promise.all([targetingRules, targeting, variations])}>
                {([targetingRules, targeting, variations]: [
                    TargetingRuleResponse[],
                    TargetingResponse,
                    VariationResponse[]
                ]) => (
                    <>
                        <Formik
                            initialValues={{ ...targeting.attributes }}
                            onSubmit={async (values) => await updateTargeting(targeting.attributes, values)}
                        >
                            {({ values, setFieldValue }) => (
                                <Form>
                                    <div className="mb-4 flex gap-5 items-center">
                                        <Switch.Group as="div" className="flex items-center">
                                            <Switch
                                                name="enabled"
                                                checked={values.enabled}
                                                onChange={async (checked: boolean) => {
                                                    await updateTargeting(targeting.attributes, {
                                                        ...values,
                                                        enabled: checked,
                                                    })
                                                    return setFieldValue('enabled', checked)
                                                }}
                                                className={classNames(
                                                    values.enabled ? 'bg-indigo-600' : 'bg-gray-200',
                                                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
                                                )}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={classNames(
                                                        values.enabled ? 'translate-x-5' : 'translate-x-0',
                                                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                                    )}
                                                />
                                            </Switch>
                                        </Switch.Group>
                                        <h1 className="text-base font-semibold leading-6 text-gray-900 text-xl">
                                            {values?.enabled ? 'Enabled' : 'Disabled'}
                                        </h1>
                                    </div>
                                    <p className="mt-2 max-w-4xl text-sm text-gray-500">
                                        {values?.enabled
                                            ? 'Users will evaluate the targeting rules below'
                                            : 'Users will evaluate the fallthrough variations'}
                                    </p>
                                    <div className={values.enabled ? 'blur-sm mb-5' : ''}>
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
                                            <div className="block hover:bg-gray-50">
                                                <div className="px-4 py-4 sm:px-6">
                                                    <div className="flex gap-5 items-center mb-4">
                                                        {values?.fallthroughVariations?.map((variation, i) => {
                                                            return (
                                                                <div key={variation?.variationKey}>
                                                                    <Field
                                                                        min="0"
                                                                        max="100"
                                                                        placeholder={variation.weight}
                                                                        type="number"
                                                                        component={Input}
                                                                        name={`fallthroughVariations.${i}.weight`}
                                                                        label={`${variation.variationKey} %`}
                                                                        style={{ width: '80px' }}
                                                                    />
                                                                </div>
                                                            )
                                                        })}
                                                        <div
                                                            className={`ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 rounded-full ${
                                                                isValidVariationSum(values?.fallthroughVariations)
                                                                    ? 'bg-green-200 text-green-700'
                                                                    : 'bg-red-200 text-red-700'
                                                            }`}
                                                        >
                                                            {isValidVariationSum(values?.fallthroughVariations)
                                                                ? 'Σ ='
                                                                : 'Σ ≠'}{' '}
                                                            100%
                                                        </div>
                                                    </div>
                                                    <Button
                                                        disabled={
                                                            objectsEqual(values, targeting?.attributes) ||
                                                            !isValidVariationSum(values?.fallthroughVariations)
                                                        }
                                                        className={`mt-3 py-2 justify-center mr-5 ${
                                                            objectsEqual(values, targeting?.attributes) ||
                                                            !isValidVariationSum(values?.fallthroughVariations)
                                                                ? 'bg-slate-50 hover:bg-slate-50 text-red-500'
                                                                : ''
                                                        }`}
                                                        type="submit"
                                                    >
                                                        Update
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
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
                                            onClick={async () => await createRule(variations, targetingRules)}
                                            secondary
                                        >
                                            New Rule
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-hidden bg-white shadow sm:rounded-md">
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
                            </div>
                        </div>
                    </>
                )}
            </Await>
        </Suspense>
    )
}
