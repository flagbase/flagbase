import React from 'react'
import { FieldInputProps, FormikFormProps, FormikProps } from 'formik'

export type InputProps = {
    prefix?: React.ReactNode
    field: FieldInputProps<any>
    form: FormikProps<any>
} & FormikFormProps

const Input: React.FC<InputProps> = ({ prefix, field, form, ...props }) => {
    const { placeholder } = props
    const name = field?.name
    const errors = form?.errors[name]
    const isTouched = form?.touched[name]
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{name}</label>
            <div className="relative mt-1 rounded-md shadow-sm">
                {prefix && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">{prefix}</div>
                )}
                <input
                    type="text"
                    id={name}
                    className={`block w-full rounded-md border-gray-300 ${
                        prefix && 'pl-10'
                    } focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                    placeholder={placeholder}
                    {...props}
                    {...field}
                />
            </div>

            {errors && isTouched && <span style={{ color: 'red' }}>{errors}</span>}
        </div>
    )
}

export default Input
