import React from 'react'
import { Input as AntdInput, InputProps as AntdInputProps } from 'antd'
import Label from './label'
import { SearchOutlined } from '@ant-design/icons'
import { FormikFormProps } from 'formik'

export type InputProps = {
    field: {
        name: string
    }
    form: {
        errors?: any
    }
} & AntdInputProps &
    FormikFormProps

const Input: React.FC<InputProps> = ({ field, form, ...props }) => {
    const { placeholder } = props
    const name = field?.name
    const errors = form?.errors[name]
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{name}</label>
            <div className="relative mt-1 rounded-md shadow-sm">
                <input
                    type="text"
                    id={name}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder={placeholder}
                    {...props}
                    {...field}
                />
                {/* <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <SearchOutlined className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div> */}
            </div>

            {errors && <span style={{ color: 'red' }}>{errors}</span>}
        </div>
    )
}

export default Input
