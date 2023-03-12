import { Field, Form, Formik } from 'formik'
import React, { Suspense, useState } from 'react'
import { Await, useLoaderData } from 'react-router-dom'
import Button from '../../../components/button/button'
import { SettingsContainer } from '../../../components/container/SettingsContainer'
import Input from '../../../components/input/input'
import { Toggle } from '../../../components/input/toggle'
import { Loader } from '../../../components/loader'
import { Notification } from '../../../components/notification/notification'
import { EditEntityHeading } from '../../../components/text/heading'
import { useFlagbaseParams } from '../../lib/use-flagbase-params'
import { SDK } from './api'
import { useSDKs } from './sdks'

export const SdkSettings = () => {
    const { sdks: prefetchedSdks } = useLoaderData() as { sdks: SDK[] }
    const [success, setSuccess] = useState(false)
    const { instanceKey, workspaceKey, projectKey, environmentKey, sdkKey } = useFlagbaseParams()

    const { data: sdks, isLoading } = useSDKs({ instanceKey, workspaceKey, projectKey, environmentKey })
    const sdk = sdks?.find((sdk) => sdk.id === sdkKey)

    if (isLoading) {
        return <Loader />
    }

    if (!sdk) {
        return null
    }

    console.log('sdk', sdk)

    return (
        <Suspense fallback={<Loader />}>
            <Await resolve={prefetchedSdks}>
                {(sdks: SDK[]) => (
                    <SettingsContainer>
                        <Notification
                            title="Success!"
                            content="SDK settings updated successfully"
                            show={success}
                            setShow={setSuccess}
                        />
                        <EditEntityHeading heading="SDK Settings" subheading={sdk?.attributes.name} />
                        <Formik
                            initialValues={{
                                description: sdk?.attributes.description,
                                enabled: sdk?.attributes.enabled,
                                clientKey: sdk?.attributes.clientKey,
                                serverKey: sdk?.attributes.serverKey,
                            }}
                            onSubmit={(values: { enabled: boolean; clientKey: string; serverKey: string }) => {
                                setSuccess(true)
                            }}
                        >
                            <Form className="flex flex-col gap-3">
                                <Field component={Input} name="description" label="Description" />

                                <Field component={Input} name="clientKey" label="Client Key" disabled />
                                <Field component={Input} name="serverKey" label="Server Key" disabled />
                                <Field component={Toggle} type="checkbox" name="enabled" label="Enabled" />
                                <div className="flex justify-start gap-3">
                                    <Button
                                        type="submit"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                                    >
                                        Update
                                    </Button>
                                </div>
                            </Form>
                        </Formik>
                    </SettingsContainer>
                )}
            </Await>
        </Suspense>
    )
}
