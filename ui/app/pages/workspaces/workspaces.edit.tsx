import { MinusCircleIcon } from '@heroicons/react/24/outline'
import { Field, Form, Formik } from 'formik'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../../components/button/button'
import Input from '../../../components/input/input'
import { Instance } from '../../context/instance'
import { useAddInstance, useInstance, useRemoveInstance, useUpdateInstance } from '../instances/instances'
import { InstanceSchema } from '../instances/instances.constants'

useAddInstance
const EditInstance = ({ instanceKey }: { instanceKey: string }) => {
    const instance = useInstance(instanceKey)
    const navigate = useNavigate()
    const { mutate: update } = useUpdateInstance()
    const { mutate: remove } = useRemoveInstance()

    if (!instance) return <div>Loading...</div>

    const removeInstance = () => {
        remove(instance)
        navigate('/instances')
    }

    return (
        <main className="mx-auto max-w-lg px-4 pt-10 pb-12 lg:pb-16">
            <div>
                <div className="mb-4">
                    <h1 className="text-lg font-medium leading-6 text-gray-900">Instance Settings </h1>
                    <p className="mt-1 text-sm text-gray-500">{instance.key}</p>
                </div>

                <Formik
                    initialValues={{
                        key: instance.key,
                        connectionString: instance.connectionString,
                        accessKey: instance.accessKey,
                        accessSecret: instance.accessSecret,
                    }}
                    onSubmit={(values: Omit<Instance, 'expiresAt' | 'id' | 'accessToken'>) => {
                        update({
                            ...instance,
                            ...values,
                            key: instance.key,
                            newKey: values.key,
                        })
                        navigate('/instances')
                    }}
                    validationSchema={InstanceSchema}
                >
                    <Form className="flex flex-col gap-5 mb-14">
                        <Field component={Input} name="key" label="Instance Name" />
                        <Field component={Input} name="connectionString" label="Connection String" />
                        <Field component={Input} name="accessKey" label="Access Key" />
                        <Field component={Input} name="accessSecret" label="Access Secret" type="password" />

                        <div className="flex justify-start gap-3">
                            <Button
                                type="submit"
                                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                            >
                                Update
                            </Button>
                            <Button
                                type="button"
                                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                            >
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </Formik>

                <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-3 text-base font-semibold leading-6 text-gray-900">
                            Danger Zone
                        </span>
                    </div>
                </div>
                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Delete this instance</h3>
                        <div className="mt-2 max-w-xl text-sm text-gray-500">
                            <p>Once you delete your instance, there is no going back. Please be certain.</p>
                        </div>
                        <div className="mt-5">
                            <button
                                onClick={removeInstance}
                                type="button"
                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm"
                            >
                                Delete instance
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default EditInstance
