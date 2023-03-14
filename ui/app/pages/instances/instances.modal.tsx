import { Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { Instance } from '../../context/instance'
import { ReactState } from '../workspaces/modal'
import { ModalLayout } from '../../../components/layout'
import { Field, Form, Formik, FormikHelpers, useFormikContext } from 'formik'
import { InstanceSchema } from './instances.constants'
import Input from '../../../components/input'
import Button from '../../../components/button/button'
import { useQueryClient } from 'react-query'
import { useAddInstance } from './instances'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { Notification } from '../../../components/notification/notification'

type OmittedInstance = Omit<Instance, 'expiresAt'>

const InstanceForm = ({ visible, setVisible, errors }: ReactState & { errors: any }) => {
    const { Title, Text } = Typography
    const { submitForm } = useFormikContext<OmittedInstance>()
    return (
        <>
            <ModalLayout open={visible} onClose={() => setVisible(false)}>
                <div className="flex flex-col gap-3">
                    <div className="text-center">
                        <Title level={3}>Add a new instance</Title>
                        <Text>Connect to a Flagbase instance to begin managing your flags</Text>
                    </div>
                    <Form className="flex flex-col gap-3">
                        <Field component={Input} id="key" name="key" label="Instance Name" placeholder="i.e. Shared Flagbase Core API" />
                        <Field
                            component={Input}
                            id="connectionString"
                            name="connectionString"
                            label="Connection String"
                            placeholder="i.e. https://api.core.flagbase.com"
                        />
                        <Field component={Input} id="accessKey" name="accessKey" label="Access Key" placeholder="i.e. root" />
                        <Field
                            component={Input}
                            id="accessSecret"
                            name="accessSecret"
                            label="Access Secret"
                            placeholder="i.e. toor"
                            type="password"
                        />
                        <Button
                            className="mt-3 py-2 justify-center"
                            suffix={PlusCircleIcon}
                            onClick={() => submitForm()}
                        >
                            Add Instance
                        </Button>
                    </Form>
                </div>
            </ModalLayout>
        </>
    )
}

export const AddNewInstanceModal = ({ visible, setVisible }: ReactState) => {
    const [showError, setShowError] = useState(false)
    const mutation = useAddInstance()
    const { isSuccess, isError } = mutation
    const queryClient = useQueryClient()

    const onSubmit = (values: OmittedInstance, { setSubmitting }: FormikHelpers<OmittedInstance>) => {
        mutation.mutate(values)
        setSubmitting(false)
    }

    useEffect(() => {
        if (isSuccess) {
            setVisible(false)
            queryClient.invalidateQueries('instances')
            queryClient.setQueryData('instances', (old: any) => [mutation.data])
        }
    }, [isSuccess])

    useEffect(() => {
        setShowError(isError)
    }, [isError])

    return (
        <>
            <Notification
                type="error"
                title="Could not add this instance"
                content="Did you make sure you added the correct key and secret?"
                show={showError}
                setShow={setShowError}
            />
            <Notification
                type="success"
                title="Successfully added this instance"
                content="You can now manage your flags"
                show={isSuccess}
            />
            <Formik
                initialValues={{
                    id: '',
                    connectionString: '',
                    key: '',
                    accessToken: '',
                    accessSecret: '',
                    accessKey: '',
                }}
                onSubmit={onSubmit}
                validationSchema={InstanceSchema}
            >
                {({ errors }) => <InstanceForm visible={visible} setVisible={setVisible} errors={errors} />}
            </Formik>
        </>
    )
}
