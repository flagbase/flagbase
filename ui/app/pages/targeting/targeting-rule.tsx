/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { Field, Form, Formik } from 'formik'
import { useRevalidator } from 'react-router-dom'
import Button from '../../../components/button/button'
import Input from '../../../components/input/input'
import { Select } from '../../../components/input/select'
import { TargetingRuleRequest, deleteTargetingRule, updateTargetingRule } from './api'
import { useFlagbaseParams } from '../../lib/use-flagbase-params'
import { isValidVariationSum, objectsEqual } from './targeting.utils'
import RolloutSlider from '../../../components/rollout-slider'
import { TagInput } from '../../../components/input/tag-input'
import { Toggle } from '../../../components/input/toggle'

const options = [
    { name: 'Equal', value: 'equal' },
    { name: 'Greater Than', value: 'greater_than' },
    { name: 'Greater Than or Equal', value: 'greater_than_or_equal' },
    { name: 'Contains', value: 'contains' },
    { name: 'Regex', value: 'regex' },
]

function getNameFromValue(value: string): string | undefined {
    const option = options.find((option) => option.value === value);
    return option ? option.name : undefined;
}

const TargetingRule = ({ rule }: { rule: TargetingRuleRequest }) => {
    const revalidator = useRevalidator()
    const { workspaceKey, projectKey, environmentKey, flagKey } = useFlagbaseParams()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const updateRule = (newRule: TargetingRuleRequest) => {
        setIsLoading(true)
        updateTargetingRule({ workspaceKey, projectKey, environmentKey, flagKey, ruleKey: rule.key }, rule, newRule)
        console.log(newRule)
        revalidator.revalidate()
        setTimeout(() => setIsLoading(false), 2000)
    }

    const deleteRule = async (ruleKey: string) => {
        setIsLoading(true)
        deleteTargetingRule({ workspaceKey, projectKey, environmentKey, flagKey, ruleKey })
        revalidator.revalidate()
        setTimeout(() => setIsLoading(false), 2000)
    }
    return (
        <Formik initialValues={{ ...rule }} onSubmit={updateRule}>
            {({ values, setFieldValue }) => (
                <Form>
                    <div className="flex">
                        <div className="flex-auto w-80">
                            <div className="flex gap-3 items-center mb-4">
                                <code className="text-xl font-bold uppercase">if</code>
                                <Field component={Input} name="traitKey" label="Trait Key" />
                                <Field
                                    component={Select}
                                    options={options}
                                    onChange={(operator: string) => {
                                        setFieldValue('operator', operator)
                                    }}
                                    name="operator"
                                    label="Operator"
                                    value={{ value: values.operator, name: getNameFromValue(values.operator) }}
                                />
                                <Field component={Input} name="traitValue" label="Trait Value" />
                            </div>
                            <div className="flex gap-5 items-center mb-4">
                                <Field component={Toggle} type="checkbox" name="negate" label="Negate" />
                            </div>
                            <div className="flex gap-5 items-center">
                                <code className="text-xl font-bold uppercase">Then Serve</code>
                            </div>
                            <RolloutSlider
                                data={rule?.ruleVariations}
                                onChange={(data) => {
                                    data.forEach((varation, i) => {
                                        setFieldValue(`ruleVariations.${i}.weight`, varation.weight)
                                    })
                                }}
                            />
                        </div>
                        <div className="flex-auto w-20 pl-5">
                            <Field component={Input} name="key" label="Rule Key" />
                            <Field component={Input} name="name" label="Name" />
                            <Field component={Input} name="description" label="Description" />
                            <Field component={TagInput} name="tags" label="Tags" />
                        </div>
                    </div>
                    <div className="flex">
                        <Button
                            disabled={objectsEqual(values, rule) || !isValidVariationSum(values.ruleVariations)}
                            className={`mt-3 mr-3 py-1 justify-center ${
                                objectsEqual(values, rule) || !isValidVariationSum(values?.ruleVariations)
                                    ? 'bg-indigo-50 hover:bg-indigo-50'
                                    : 'bg-indigo-600'
                            }`}
                            type="submit"
                            isLoading={isLoading}
                        >
                            Update
                        </Button>
                        <Button
                            className="mt-3 py-1 justify-center mr-5 bg-red-500 hover:bg-red-600"
                            onClick={() => deleteRule(rule.key)}
                            isLoading={isLoading}
                        >
                            Delete
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default TargetingRule
