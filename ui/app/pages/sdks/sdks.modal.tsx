import React, { useState } from 'react'
import { ReactState } from '../workspaces/modal'
import { ModalLayout } from '../../../components/layout'
import { Field, Form, Formik } from 'formik'
import Input from '../../../components/input'
import Button from '../../../components/button/button'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { Notification } from '../../../components/notification/notification'
import { Heading } from '../../../components/text/heading'
import { createSdkKey, CreateSdkKeyRequest } from './api'
import { useFlagbaseParams } from '../../lib/use-flagbase-params'

export const AddNewSDKModal = ({ visible, setVisible }: ReactState) => {
    const [showError, setShowError] = useState(false)
    const { workspaceKey, projectKey, environmentKey } = useFlagbaseParams()
    if (!workspaceKey || !projectKey || !environmentKey) {
        return null
    }

    return (
        <>
            <Notification
                title="Could not add this instance"
                content="Did you make sure you added the correct key and secret?"
                show={showError}
                setShow={setShowError}
            />
            <Notification
                title="Successfully added this instance"
                content="You can now manage your flags"
                show={false}
            />
            <ModalLayout open={visible} onClose={() => setVisible(false)}>
                <div className="flex flex-col gap-3">
                    <div className="text-center">
                        <Heading>Add a new SDK</Heading>
                    </div>
                    <Formik
                        initialValues={
                            {
                                name: '',
                            } as CreateSdkKeyRequest
                        }
                        onSubmit={(values) => {
                            createSdkKey({
                                workspaceKey,
                                projectKey,
                                environmentKey,
                                sdkKeyRequest: {
                                    name: values.name,
                                    tags: values.tags?.split(','),
                                },
                            })
                        }}
                    >
                        {({ errors }) => (
                            <Form className="flex flex-col gap-3">
                                <Field component={Input} id="name" name="name" label="Name" placeholder="sdk-name" />
                                <Field component={Input} id="tags" name="tags" label="Tags" placeholder="tag1, tag2" />
                                <Button type="submit" className="mt-3 py-2 justify-center" suffix={PlusCircleIcon}>
                                    Add SDK
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </ModalLayout>
        </>
    )
}
