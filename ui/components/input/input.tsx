import React, { createElement, useEffect } from 'react'
import { FieldInputProps, FormikFormProps, FormikProps, useField, useFormikContext } from 'formik'
import { classNames } from '../../helpers'

export type InputProps = {
    prefix?: React.ReactNode
    field: FieldInputProps<any>
    form: FormikProps<any>
    label?: string
} & Omit<FormikFormProps, 'prefix'>

const Input: React.FC<InputProps> = ({ prefix, field, form, label, ...props }) => {
    const { placeholder } = props
    const name = field?.name
    const errors = form?.errors[name]
    const isTouched = form?.touched[name]
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
                        isTouched && errors ? 'border-red-600' : 'border-gray-300',
                        'disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200'
                    )}
                    placeholder={placeholder}
                    {...props}
                    {...field}
                />
            </div>

            {errors && isTouched && <span className="text-red-600 mt-1">{errors}</span>}
        </div>
    )
}

export const KeyInput = ({ field, prefix, placeholder }: { field: FieldInputProps<any>; prefix?: React.ReactNode }) => {
    const {
        values: { name },
        touched,
        setFieldValue,
    } = useFormikContext()

    console.log('field', field, name)
    useEffect(() => {
        if (name.trim() !== '') {
            setFieldValue(field.name, name.split(' ').join('-').toLowerCase())
        }
    }, [name, setFieldValue, field.name])

    return (
        <>
            <input
                className={classNames(
                    `block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`,
                    prefix ? 'pl-10' : '',
                    'disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200'
                )}
                type="text"
                placeholder={placeholder}
                {...field}
            />
        </>
    )
}

type RawInputProps = {
    prefix?: any
    label?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export const RawInput: React.FC<RawInputProps> = ({ prefix, label, ...props }) => {
    const { placeholder } = props

    return (
        <div className="relative rounded-md shadow-sm">
            {prefix && (
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    {createElement(prefix, { className: 'h-5 w-5' })}
                </div>
            )}
            <input
                type="text"
                className={classNames(
                    `block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`,
                    prefix ? 'pl-10' : ''
                )}
                placeholder={placeholder}
                {...props}
            />
        </div>
    )
}
export default Input
