import React, { ReactNode } from 'react'
import { classNames } from '../../helpers'

export const Heading = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
    return <h1 className={classNames('text-lg font-medium leading-6 text-gray-900', className)}>{children}</h1>
}

export const EditEntityHeading = ({ heading, subheading }: { heading: string; subheading: string }) => {
    return (
        <div className="mb-4">
            <h1 className="text-lg font-medium leading-6 text-gray-900">{heading} </h1>
            <p className="mt-1 text-sm text-gray-500">{subheading}</p>
        </div>
    )
}
