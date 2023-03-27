import React, { createElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { classNames } from '../../helpers'
import LoadingText from '../loading-text'

export type ButtonProps = {
    children: React.ReactChild
    suffix?: any
    prefix?: any
    goBack?: boolean
    secondary?: boolean
    isLoading?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Button: React.FC<ButtonProps> = ({
    className = '',
    prefix,
    secondary,
    suffix,
    goBack = false,
    isLoading = false,
    ...props
}) => {
    const navigate = useNavigate()

    return (
        <button
            type="button"
            className={classNames(
                isLoading
                    ? 'inline-flex items-center rounded-md bg-white px-3 py-2 text-sm text-black font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-white'
                    : '',
                !secondary
                    ? 'inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                    : '',
                secondary
                    ? 'inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                    : '',
                className
            )}
            {...props}
            onClick={(e) => {
                if (props.onClick) {
                    props.onClick(e)
                }
                if (goBack) {
                    navigate(-1)
                }
            }}
            disabled={isLoading}
        >
            {prefix && createElement(prefix, { className: 'mr-3 h-5 w-5' })}
            {isLoading ? <LoadingText /> : props.children}
            {suffix && createElement(suffix, { className: 'ml-3 -mr-1 h-5 w-5' })}
        </button>
    )
}

export default Button
