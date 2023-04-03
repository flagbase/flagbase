import React, { createElement, useEffect } from 'react'
import { FieldInputProps, useFormikContext } from 'formik'
import { classNames } from '../../helpers'

export type InputProps = {
    prefix?: React.ElementType
    label?: string
    placeholder?: string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'>

const Input: React.FC<InputProps> = ({ prefix, className, ...props }) => {
    return (
        <div className="relative rounded-md shadow-sm">
            {prefix && (
                <div
                    data-testid="prefix"
                    className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                >
                    {createElement(prefix)}
                </div>
            )}
            <input
                type="text"
                className={classNames(
                    `block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`,
                    prefix ? 'pl-10' : '',
                    'disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200',
                    className ? className : ''
                )}
                {...props}
            />
        </div>
    )
}

export const KeyInput = ({
    field,
    prefix,
    placeholder,
    label,
}: {
    field: FieldInputProps<any>
    prefix?: React.ReactNode
    placeholder?: string
    label?: string
}) => {
    const {
        values: { name },
        touched,
        setFieldValue,
    } = useFormikContext()

    useEffect(() => {
        if (name.trim() !== '') {
            setFieldValue(field.name, name.split(' ').join('-').toLowerCase())
        }
    }, [name, setFieldValue, field.name])

    return (
        <div>
            {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

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
        </div>
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
