import React, { ReactNode } from 'react'
import { classNames } from '../../helpers'

export const Heading = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
    return <h1 className={classNames('text-lg font-medium leading-6 text-gray-900', className)}>{children}</h1>
}
