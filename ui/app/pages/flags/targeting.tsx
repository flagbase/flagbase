/* eslint-disable react/prop-types */
import { CheckCircleIcon, MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import { Field, FieldArray, Form, Formik } from 'formik'
import React, { Suspense } from 'react'
import { Await, useLoaderData } from 'react-router-dom'
import Button from '../../../components/button/button'
import { Divider } from '../../../components/divider'
import Input from '../../../components/input/input'
import { Select } from '../../../components/input/select'
import { Loader } from '../../../components/loader'
import { Heading } from '../../../components/text/heading'
import { useFlagbaseParams } from '../../lib/use-flagbase-params'
import { useFlags } from './flags'

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

const TargetingRowInput = ({
    onAdd,
    onRemove,
    rowIndex,
}: {
    onAdd?: () => void
    onRemove?: () => void
    rowIndex: number
}) => {
    return (
        <div>
            <div className="flex gap-3 items-center mb-2">
                <Field component={Input} name={`rules[${rowIndex}].traitKey`} placeholder="Trait Key" />
                <Field component={Select} name={`rules[${rowIndex}].operand`} placeholder="Trait Key" />
                <Field component={Input} name={`rules[${rowIndex}].traitValue`} placeholder="Trait Value" />
                {!!onAdd && <PlusCircleIcon onClick={onAdd} className="cursor-pointer h-7 w-7 text-indigo-600" />}
                {!!onRemove && (
                    <MinusCircleIcon onClick={onRemove} className="cursor-pointer h-7 w-7 text-indigo-600" />
                )}
            </div>
            <div className="flex gap-5 items-center">
                <div>
                    <span className="text-2xl font-bold">Then</span>
                </div>
                <div>A%</div>
                <div>B%</div>
                <div>C%</div>
            </div>
        </div>
    )
}

type TargetingRuleResponse = {
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

export const Targeting = () => {
    const { data: flags } = useFlags()
    const { flagKey } = useFlagbaseParams()
    const { targetingRules } = useLoaderData() as { targetingRules: TargetingRuleResponse }
    const flag = flags?.find((flag) => flag.attributes.key === flagKey)

    return (
        <Suspense fallback={<Loader />}>
            <Await resolve={targetingRules}>
                {(targetingRules: TargetingRuleResponse) => (
                    <div className="mt-5">
                        {console.log('Target', targetingRules)}
                        <Heading className="mb-2">Targeting Rules</Heading>
                        <Divider />
                        <Formik
                            initialValues={{
                                rules:
                                    targetingRules && targetingRules.length > 0
                                        ? convertResponseToBody(targetingRules)
                                        : ([
                                              {
                                                  key: 'Key',
                                                  name: '',
                                                  description: '',
                                                  tags: [],
                                                  type: 'trait',
                                                  traitKey: 'Key',
                                                  traitValue: 'Value',
                                                  operator: 'equals',
                                                  ruleVariations: [
                                                      {
                                                          variationKey: 'on',
                                                          weight: 100,
                                                      },
                                                  ],
                                              },
                                          ] as TargetingRuleRequest[]),
                            }}
                            onSubmit={(values) => {
                                console.log('values', values)
                            }}
                        >
                            {({ values }) => (
                                <Form>
                                    <FieldArray name="rules">
                                        {({ insert, remove, push }) => (
                                            <>
                                                <div className="flex flex-col gap-3 mb-5">
                                                    {values.rules.map((rule, index) => (
                                                        <TargetingRowInput
                                                            key={rule.key}
                                                            rowIndex={index}
                                                            onRemove={() => remove(index)}
                                                        />
                                                    ))}
                                                    <PlusCircleIcon
                                                        onClick={() =>
                                                            push({
                                                                traitKey: '',
                                                                operand: 'equals',
                                                                traitValue: '',
                                                            })
                                                        }
                                                        className="cursor-pointer h-7 w-7 text-indigo-600"
                                                    />
                                                </div>
                                                <Button type="submit" prefix={CheckCircleIcon} className="py-2">
                                                    Save
                                                </Button>
                                            </>
                                        )}
                                    </FieldArray>
                                </Form>
                            )}
                        </Formik>
                    </div>
                )}
            </Await>
        </Suspense>
    )
}
