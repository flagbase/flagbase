import React from 'react'
import { classNames } from '../../helpers'
export default function Tag({
    children,
    className,
    color = 'blue',
}: {
    children: React.ReactNode
    className: string
    color?: keyof typeof colors
}) {
    const colors = {
        gray: 'bg-gray-100 text-gray-800',
        red: 'bg-red-100 text-red-800',
        yellow: 'bg-yellow-100 text-yellow-800',
        green: 'bg-green-100 text-green-800',
        blue: 'bg-blue-100 text-blue-800',
        indigo: 'bg-indigo-100 text-indigo-800',
        purple: 'bg-purple-100 text-purple-800',
        pink: 'bg-pink-100 text-pink-800',
    }
    return (
        <span
            className={classNames(
                'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium',
                colors[color],
                className
            )}
        >
            {children}
        </span>
    )
}
