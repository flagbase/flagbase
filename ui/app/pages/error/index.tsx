import React from 'react'
import { useAsyncError } from 'react-router-dom'

export const Error = () => {
    const error = useAsyncError() as any
    console.log('ERROR', error)

    const errors = error?.response?.data?.errors || []
    console.log(error)
    return (
        <div>
            <h1>Something went wrong</h1>
            <ul role="list" className="-my-5 divide-y divide-gray-200">
                {errors.map((error) => (
                    <li key={error.code} className="py-5">
                        <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                            <h3 className="text-sm font-semibold text-gray-800">
                                <span>
                                    {/* Extend touch target to entire panel */}
                                    <span className="absolute inset-0" aria-hidden="true" />
                                    {error.code}
                                </span>
                            </h3>
                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">{error.message}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
