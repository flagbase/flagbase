import React, { useState } from 'react'
import { ReactState } from '../workspaces/modal'
import { ModalLayout } from '../../../components/layout'
import { Field, Form, Formik } from 'formik'
import Input from '../../../components/input'
import Button from '../../../components/button/button'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { Notification } from '../../../components/notification/notification'
import { Heading } from '../../../components/text/heading'
import { createSdkKey, CreateSdkKeyRequest, deleteSdk, updateSdk } from './api'
import { useFlagbaseParams } from '../../lib/use-flagbase-params'
import { TagInput } from '../../../components/input/tag-input'
import { useMutation, useQueryClient } from 'react-query'
import { getSdkKey } from '../../router/loaders'
import { configureAxios } from '../../lib/axios'

export const useUpdateSdk = () => {
    const queryClient = useQueryClient()
    const { workspaceKey, projectKey, environmentKey, instanceKey } = useFlagbaseParams()
    const mutation = useMutation({
        mutationFn: async (values: { id: string; description: string; tags: string[]; enabled: boolean }) => {
            await configureAxios(instanceKey!)
            await updateSdk({
                workspaceKey: workspaceKey!,
                projectKey: projectKey!,
                environmentKey: environmentKey!,
                sdkId: values.id,
                body: [
                    {
                        op: 'replace',
                        path: '/description',
                        value: values.description,
                    },
                    {
                        op: 'replace',
                        path: '/tags',
                        value: values.tags,
                    },
                    {
                        op: 'replace',
                        path: '/enabled',
                        value: values.enabled,
                    },
                ],
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getSdkKey({
                    instanceKey: instanceKey!,
                    workspaceKey: workspaceKey!,
                    projectKey: projectKey!,
                    environmentKey: environmentKey!,
                }),
            })
        },
    })
    return mutation
}

export const useRemoveSdk = () => {
    const { instanceKey, workspaceKey, environmentKey, projectKey } = useFlagbaseParams()

    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (key: string) => {
            await configureAxios(instanceKey!)
            return deleteSdk({
                workspaceKey: workspaceKey!,
                projectKey: projectKey!,
                environmentKey: environmentKey!,
                sdkId: key,
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getSdkKey({
                    instanceKey: instanceKey!,
                    workspaceKey: workspaceKey!,
                    projectKey: projectKey!,
                    environmentKey: environmentKey!,
                }),
            })
        },
    })
    return mutation
}

export const useAddSdk = () => {
    const { instanceKey, workspaceKey, environmentKey, projectKey } = useFlagbaseParams()
    const queryClient = useQueryClient()
    return useMutation(
        (sdk: CreateSdkKeyRequest) =>
            createSdkKey({
                workspaceKey: workspaceKey!,
                projectKey: projectKey!,
                environmentKey: environmentKey!,
                body: {
                    name: sdk.name,
                    tags: sdk.tags,
                    description: sdk.description,
                    enabled: true,
                },
            }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(
                    getSdkKey({
                        instanceKey: instanceKey!,
                        workspaceKey: workspaceKey!,
                        projectKey: projectKey!,
                        environmentKey: environmentKey!,
                    })
                )
            },
        }
    )
}

export const AddNewSDKModal = ({ visible, setVisible }: ReactState) => {
    const { workspaceKey, projectKey, environmentKey } = useFlagbaseParams()
    const { mutate, isError, isSuccess } = useAddSdk()
    if (!workspaceKey || !projectKey || !environmentKey) {
        return null
    }

    return (
        <>
            <Notification
                type="error"
                title="Could not add this instance"
                content="Did you make sure you added the correct key and secret?"
                show={isError}
            />
            <Notification
                type="success"
                title="Successfully added this instance"
                content="You can now manage your flags"
                show={isSuccess}
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
                                description: '',
                                tags: [],
                            } as CreateSdkKeyRequest
                        }
                        onSubmit={async (values) => {
                            mutate(values)
                            setVisible(false)
                        }}
                    >
                        {({ errors }) => (
                            <Form className="flex flex-col gap-3">
                                <Field component={Input} id="name" name="name" label="Name" placeholder="sdk-name" />
                                <Field
                                    component={Input}
                                    id="description"
                                    name="description"
                                    label="Description"
                                    placeholder="SDK Description"
                                />

                                <Field
                                    component={TagInput}
                                    id="tags"
                                    name="tags"
                                    label="Tags"
                                    placeholder="syd-region"
                                />
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
