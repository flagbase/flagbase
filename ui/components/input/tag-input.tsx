import { FieldInputProps, FormikProps, FormikFormProps } from 'formik'
import React, { createElement, useEffect } from 'react'
import { classNames } from '../../helpers'

export type TagInputProps = {
    prefix?: React.ReactNode
    field: FieldInputProps<any>
    form: FormikProps<any>
    label?: string
} & Omit<FormikFormProps, 'prefix'>

export const TagInput: React.FC<TagInputProps> = ({ prefix, field, form, label, ...props }) => {
    const { placeholder } = props
    const name = field?.name
    const errors = form?.errors[name]
    const isTouched = form?.touched[name]

    useEffect(() => {
        console.log('value', field.value)
    }, [field.value])

    return (
        <div>
            {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
            <div className="relative rounded-md shadow-sm">
                {prefix && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        {createElement(prefix)}
                    </div>
                )}
                <input
                    type="text"
                    id={name}
                    className={classNames(
                        `block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`,
                        prefix ? 'pl-10' : '',
                        isTouched && errors ? 'border-red-600' : 'border-gray-300'
                    )}
                    placeholder={placeholder}
                    {...props}
                    {...field}
                />
            </div>
        </div>
    )
}
