import { Modal, Typography } from 'antd'
import React, { useContext, useEffect } from 'react'
import { Instance, InstanceContext } from '../../context/instance'
import { fetchAccessToken } from '../workspaces/api'
import { ReactState } from '../workspaces/modal'
import { ModalLayout } from '../../../components/layout'
import { axios } from '../../lib/axios'
import { Field, Form, Formik, FormikHelpers, useFormikContext } from 'formik'
import { InstanceSchema } from './instances.constants'
import Input from '../../../components/input'
import Button from '../../../components/button/button'
import { useMutation, useQueryClient } from 'react-query'
import { useAddInstance, useInstances } from './instances'

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
                        <Field component={Input} id="key" name="key" placeholder="Instance Name" />
                        <Field component={Input} id="connectionString" name="connectionString" placeholder="URL" />
                        <Field component={Input} id="accessKey" name="accessKey" placeholder="Key" />
                        <Field component={Input} id="accessSecret" name="accessSecret" placeholder="***" />
                        <Button className="mt-3" onClick={() => submitForm()}>
                            Add Instance
                        </Button>
                    </Form>
                </div>
            </ModalLayout>
        </>
    )
}

export const AddNewInstanceModal = ({ visible, setVisible }: ReactState) => {
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
        if (isError) {
            Modal.error({
                title: 'Could not add this instance',
                content: `Did you make sure you added the correct key and secret? Error: ${mutation.error}`,
            })
        }
    }, [isError])

    return (
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
            {({ errors, touched }) => <InstanceForm visible={visible} setVisible={setVisible} errors={errors} />}
        </Formik>
    )
}
