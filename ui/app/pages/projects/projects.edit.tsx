import React from 'react'
import { useParams } from 'react-router-dom'
import { useInstance } from '../instances/instances'

const EditProject = () => {
    const { instanceKey } = useParams<{ instanceKey: string }>()

    const instance = useInstance(instanceKey)

    if (!instance) return <div>Loading...</div>

    return (
        <main className="mx-auto max-w-lg px-4 pt-10 pb-12 lg:pb-16">
            <div>
                <div className="mb-4">
                    <h1 className="text-lg font-medium leading-6 text-gray-900">Project Settings </h1>
                </div>

                <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center"></div>
                </div>
            </div>
        </main>
    )
}

export default EditProject
