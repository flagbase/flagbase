import React from 'react'
import { Input as AntdInput, InputProps as AntdInputProps } from 'antd'
import Label from './label'
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

const Input: React.FC<InputProps> = (props) => {
    console.log(props)
    const { placeholder } = props
    const name = props.field.name
    const errors = props.form?.errors[name]
    return (
        <>
            <Label name={name} />
            <AntdInput placeholder={placeholder} name={name} style={{ borderRadius: '2px' }} {...props} />
            {errors && <span style={{ color: 'red' }}>{errors}</span>}
        </>
    )
}

export default Input
