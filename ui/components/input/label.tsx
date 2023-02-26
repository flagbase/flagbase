import React from 'react'
import { Input as AntdInput, InputProps as AntdInputProps } from 'antd'
import styled from '@emotion/styled'

const StyledLabel = styled.label`
    display: block;
    font-size: 0.9rem;
    font-weight: bold;
    text-align: left;
    line-height: 1.5rem;
`
export type InputProps = {
    name: string
} & AntdInputProps

const Label: React.FC<InputProps> = (props) => {
    const { name } = props
    return <StyledLabel htmlFor={name}>{name}</StyledLabel>
}

export default Label
