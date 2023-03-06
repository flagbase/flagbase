import React from 'react'
import { classNames } from '../../helpers'

export const Heading = ({ text, className = '' }: { text: string; className?: string }) => {
    return <h1 className={classNames('text-lg font-medium leading-6 text-gray-900', className)}>{text}</h1>
}
