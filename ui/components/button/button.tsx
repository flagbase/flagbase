import React from 'react'
import styled from '@emotion/styled'
import { Button as AntdButton, ButtonProps as AntdButtonProps } from 'antd'

export type ButtonProps = {
    children: React.ReactChild
} & AntdButtonProps

const StyledButton = styled(AntdButton)`
    display: inline-block;
    width: fit-content;
    margin-bottom: 15px;
`

const Button: React.FC<ButtonProps> = ({ className, ...props }) => {
    return (
        <button
            type="button"
            className={`inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${className}`}
            {...props}
        />
    )
}

export default Button
