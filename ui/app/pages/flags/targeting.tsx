/* eslint-disable react/prop-types */
import { CheckCircleIcon, MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import { Field, FieldArray, Form, Formik, FormikHandlers } from 'formik'
import React, { Suspense, useEffect, useState } from 'react'
import { Await, useLoaderData } from 'react-router-dom'
import Button from '../../../components/button/button'
import { Divider } from '../../../components/divider'
import Input from '../../../components/input/input'
import { Select } from '../../../components/input/select'
import { Loader } from '../../../components/loader'
import { Heading } from '../../../components/text/heading'
import { useFlagbaseParams } from '../../lib/use-flagbase-params'
import { useFlags } from './flags'
import { Switch } from '@headlessui/react'
import { classNames } from '../../../helpers'

type operand =
    | 'equals'
    | 'notEquals'
    | 'contains'
    | 'notContains'
    | 'startsWith'
    | 'endsWith'
    | 'in'
    | 'notIn'
    | 'exists'
    | 'notExists'
    | 'greaterThan'
    | 'greaterThanOrEqual'
    | 'lessThan'
    | 'lessThanOrEqual'

type TargetingRuleRequest = {
    key: string
    name: string
    description: string
    tags: string[]
    type: 'trait'
    traitKey?: string
    traitValue?: string
    operator: operand
    ruleVariations: {
        variationKey: string
        weight: number
    }[]
    segmentKey?: string
}

const validateVariationsSum = (
    variations: {
        variationKey: string
        weight: number
    }[]
) => variations?.reduce((acc, variation) => variation.weight + acc, 0) === 100

const TargetingRowInput = ({ rule }: { rule: TargetingRuleRequest }) => {
    const updateRule = (newRule: TargetingRuleRequest) => {
        const shouldUpdate = JSON.stringify(newRule) !== JSON.stringify(rule)
        if (shouldUpdate) {
            console.log('Updating rule...', newRule)
        } else {
            console.log('Skipping update...', rule)
        }
    }
    const deleteRule = () => {
        console.log('Deleting rule...', rule)
    }
    return (
        <Formik initialValues={{ ...rule }} onSubmit={updateRule}>
            {({ values, touched }) => (
                <Form>
                    <div className="flex">
                        <div className="flex-auto w-80">
                            <div className="flex gap-3 items-center mb-4">
                                <code className="text-xl font-bold">IF</code>
                                <Field component={Input} name="traitKey" label="Trait Key" />
                                <Field component={Select} name="operator" label="Operator" />
                                <Field component={Input} name="traitValue" label="Trait Value" />
                            </div>
                            <div className="flex gap-5 items-center mb-4">
                                <code className="text-xl font-bold">Then Serve</code>
                                {rule?.ruleVariations?.map((variation, i) => {
                                    return (
                                        <div key={variation.variationKey}>
                                            <Field
                                                min="0"
                                                max="100"
                                                placeholder={variation.weight}
                                                type="number"
                                                component={Input}
                                                name={`ruleVariations.${i}.weight`}
                                                label={`${variation.variationKey} %`}
                                                style={{ width: '80px' }}
                                            />
                                        </div>
                                    )
                                })}
                                <code
                                    className={`text-sm font-bold ${
                                        validateVariationsSum(values.ruleVariations) ? 'text-green-600' : 'text-red-600'
                                    }`}
                                >
                                    ({validateVariationsSum(values.ruleVariations) ? 'total =' : 'total ≠'} 100%)
                                </code>
                            </div>
                        </div>
                        <div className="flex-auto w-20">
                            <Field component={Input} name="key" label="Key" />
                            <Field component={Input} name="name" label="Name" />
                            <Field component={Input} name="description" label="Description" />
                            <Field component={Input} name="tags" label="Tags" />
                        </div>
                    </div>
                    <div className="flex">
                        <Button
                            disabled={JSON.stringify(values) !== JSON.stringify(rule)}
                            className={`mt-3 py-2 justify-center mr-5 ${
                                JSON.stringify(values) !== JSON.stringify(rule)
                                    ? 'bg-slate-50 hover:bg-slate-50 text-slate-500'
                                    : ''
                            }`}
                            type="submit"
                        >
                            Update Rule
                        </Button>
                        <Button
                            className="mt-3 py-2 justify-center mr-5 bg-red-500 hover:bg-red-100 hover:text-slate-500"
                            onClick={deleteRule}
                        >
                            Delete Rule
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

type TargetingResponse = {
    key: string | null | undefined
    type: 'targeting'
    id: string
    attributes: {
        enabled: boolean
        fallthroughVariations: {
            variationKey: string
            weight: number
        }[]
    }
}

type TargetingRuleResponse = {
    key: string | null | undefined
    type: 'targeting_rule'
    id: string
    attributes: {
        description: string
        key: string
        name: string
        operator: operand
        ruleVariations: {
            variationKey: string
            weight: number
        }[]
        segmentKey?: string
        tags: string[]
        traitKey?: string
        traitValue?: string
        type: 'trait'
    }
}[]

const convertResponseToBody = (targetingRules: TargetingRuleResponse): TargetingRuleRequest[] => {
    return targetingRules.map((targetingRule) => {
        const { attributes } = targetingRule
        return {
            key: attributes.key,
            name: attributes.name,
            description: attributes.description,
            tags: attributes.tags,
            type: attributes.type,
            traitKey: attributes.traitKey,
            traitValue: attributes.traitValue,
            operator: attributes.operator,
            ruleVariations: attributes.ruleVariations,
            segmentKey: attributes.segmentKey,
        }
    })
}

const getNewRule = () => ({
    key: 'some-rule-key',
    name: 'Some rule name',
    description: 'Some rule description',
    tags: [],
    type: 'trait',
    traitKey: 'Key',
    traitValue: 'Value',
    operator: 'equals',
    ruleVariations: [
        {
            variationKey: 'control',
            weight: 0,
        },
        {
            variationKey: 'treatment',
            weight: 100,
        },
    ],
})

export const Targeting = () => {
    const { data: flags } = useFlags()
    const { flagKey } = useFlagbaseParams()
    const { targetingRules } = useLoaderData() as {
        targetingRules: TargetingRuleResponse,
    }
    const flag = flags?.find((flag) => flag.attributes.key === flagKey)

    const [enabled, setEnabled] = useState<boolean>(true)

    return (
        <Suspense fallback={<Loader />}>
            <Await resolve={targetingRules}>
                {(targetingRules: TargetingRuleResponse) => (
                    <div>
                        <div className="mb-4">
                            <Switch.Group as="div" className="flex items-center mt-5">
                                <Switch
                                    checked={enabled}
                                    onChange={setEnabled}
                                    className={classNames(
                                        enabled ? 'bg-indigo-600' : 'bg-gray-200',
                                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
                                    )}
                                >
                                    <span
                                        aria-hidden="true"
                                        className={classNames(
                                            enabled ? 'translate-x-5' : 'translate-x-0',
                                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                        )}
                                    />
                                </Switch>
                            </Switch.Group>
                        </div>
                        <div className={!enabled ? 'blur-sm mb-10' : 'mb-10'}>
                            <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                                <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                                    <div className="ml-4 mt-2">
                                        <h3 className="text-base font-semibold leading-6 text-gray-900">Targeting Rules</h3>
                                    </div>
                                    <div className="ml-4 mt-2 flex-shrink-0">
                                        <Button
                                            className="mt-3 py-2 justify-center text-indigo-600"
                                            type="submit"
                                            suffix={PlusCircleIcon}
                                            onClick={() => {}}
                                            secondary
                                        >
                                            New Rule
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-hidden bg-white shadow sm:rounded-md">
                                <ul role="list" className="divide-y divide-gray-200">
                                    {targetingRules.map((targetingRule) => (
                                        <li key={targetingRule.key}>
                                            <div className="block hover:bg-gray-50">
                                                <div className="px-4 py-4 sm:px-6">
                                                    <TargetingRowInput
                                                        key={targetingRule.key}
                                                        rule={targetingRule.attributes}
                                                    />
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className={enabled ? 'blur-sm mb-5' : ''}>
                            <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                                <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                                    <div className="ml-4 mt-2">
                                        <h3 className="text-base font-semibold leading-6 text-gray-900">
                                            Fallthrough rule
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-hidden bg-white shadow sm:rounded-md">
                                <ul role="list" className="divide-y divide-gray-200">
                                    <li>
                                        <div className="block hover:bg-gray-50">
                                            <div className="px-4 py-4 sm:px-6">
                                                {/* <div className="flex gap-5 items-center mb-4">
                                                    <code className="text-xl font-bold">Then Serve</code>
                                                    {targeting?.attributes.fallthroughVariations?.map(
                                                        (variation, i) => {
                                                            return (
                                                                <div key={variation.variationKey}>
                                                                    <Field
                                                                        min="0"
                                                                        max="100"
                                                                        placeholder={variation.weight}
                                                                        type="number"
                                                                        component={Input}
                                                                        name={`ruleVariations.${i}.weight`}
                                                                        label={`${variation.variationKey} %`}
                                                                        style={{ width: '80px' }}
                                                                    />
                                                                </div>
                                                            )
                                                        }
                                                    )}
                                                    <code
                                                        className={`text-sm font-bold ${
                                                            validateVariationsSum(targeting?.attributes.fallthroughVariations)
                                                                ? 'text-green-600'
                                                                : 'text-red-600'
                                                        }`}
                                                    >
                                                        ({validateVariationsSum(targeting?.attributes.fallthroughVariations) ? 'total =' : 'total ≠'} 100%)
                                                    </code>
                                                </div> */}
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </Await>
        </Suspense>
    )
}
