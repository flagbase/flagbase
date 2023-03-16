/* eslint-disable react/prop-types */
import { CheckCircleIcon, MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import { Field, FieldArray, Form, Formik } from 'formik'
import React, { Suspense, useState } from 'react'
import { Await } from 'react-router-dom'
import Button from '../../../components/button/button'
import { Divider } from '../../../components/divider'
import Input from '../../../components/input/input'
import { Select } from '../../../components/input/select'
import { Loader } from '../../../components/loader'
import { Heading } from '../../../components/text/heading'
import { useFlagbaseParams } from '../../lib/use-flagbase-params'
import { Flag } from './api'
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

type TargetingRule = {
    traitKey: string
    operand: operand
    traitValue: string
}

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
        <div className="flex gap-3 items-center">
            <Field component={Input} name={`rules[${rowIndex}].traitKey`} placeholder="Trait Key" />
            <Field component={Select} name={`rules[${rowIndex}].operand`} placeholder="Trait Key" />
            <Field component={Input} name={`rules[${rowIndex}].traitValue`} placeholder="Trait Value" />
            {!!onAdd && <PlusCircleIcon onClick={onAdd} className="cursor-pointer h-7 w-7 text-indigo-600" />}
            {!!onRemove && <MinusCircleIcon onClick={onRemove} className="cursor-pointer h-7 w-7 text-indigo-600" />}
        </div>
    )
}

export const Targeting = () => {
    const [rows, setRows] = useState<TargetingRule[]>([])
    const { data: flags } = useFlags()
    const { flagKey } = useFlagbaseParams()
    const flag = flags?.find((flag) => flag.attributes.key === flagKey)

    const addRow = () => {
        setRows([...rows, { traitKey: '', operand: 'equals', traitValue: '' }])
    }

    const removeRow = () => {
        setRows(rows.slice(0, -1))
    }

    return (
        <Suspense fallback={<Loader />}>
            <Await resolve={flag}>
                {() => (
                    <div className="mt-5">
                        <Heading className="mb-2">Targeting Rules</Heading>
                        <Divider />
                        <Formik
                            initialValues={{
                                rules: [] as TargetingRule[],
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
                                                    {values.rules.map(({ traitKey }, index) => (
                                                        <TargetingRowInput
                                                            key={traitKey}
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
