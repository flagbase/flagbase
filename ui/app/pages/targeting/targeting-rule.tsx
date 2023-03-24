/* eslint-disable react/prop-types */
import React from 'react'
import { Field, Form, Formik } from 'formik'
import { useRevalidator } from 'react-router-dom'
import Button from '../../../components/button/button'
import Input from '../../../components/input/input'
import { Select } from '../../../components/input/select'
import { TargetingRuleRequest, deleteTargetingRule, updateTargetingRule } from './api'
import { useFlagbaseParams } from '../../lib/use-flagbase-params'
import { isValidVariationSum, objectsEqual } from './targeting.utils'
import RolloutSlider from '../../../components/rollout-slider'

const TargetingRule = ({ rule }: { rule: TargetingRuleRequest }) => {
    const revalidator = useRevalidator()
    const { workspaceKey, projectKey, environmentKey, flagKey } = useFlagbaseParams()

    const updateRule = (newRule: TargetingRuleRequest) => {
        const shouldUpdate = !objectsEqual(newRule, rule)
        if (shouldUpdate) {
            updateTargetingRule({ workspaceKey, projectKey, environmentKey, flagKey, ruleKey: rule.key }, rule, newRule)
            revalidator.revalidate()
        }
    }

    const deleteRule = async (ruleKey: string) => {
        deleteTargetingRule({ workspaceKey, projectKey, environmentKey, flagKey, ruleKey })
        revalidator.revalidate()
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
                                <Field component={Select} name="operator" label="Operator" />
                                <Field component={Input} name="traitValue" label="Trait Value" />
                            </div>
                            <div className="flex gap-5 items-center mb-4">
                                <code className="text-xl font-bold uppercase">Then Serve</code>
                            </div>
                            <RolloutSlider
                                data={rule?.ruleVariations}
                                maxValue={100}
                                onChange={(data) => {
                                    data.forEach((varation, i) =>
                                        setFieldValue(`ruleVariations.${i}.weight`, varation.weight)
                                    )
                                }}
                            />
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
                            disabled={objectsEqual(values, rule) || !isValidVariationSum(values.ruleVariations)}
                            className={`mt-3 py-1 justify-center mr-5 ${
                                objectsEqual(values, rule) || !isValidVariationSum(values?.ruleVariations)
                                    ? 'bg-slate-50 hover:bg-slate-50 text-red-500'
                                    : ''
                            }`}
                            type="submit"
                        >
                            Update
                        </Button>
                        <Button
                            className="mt-3 py-1 justify-center mr-5 bg-red-500 hover:bg-red-600"
                            onClick={() => deleteRule(rule.key)}
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
