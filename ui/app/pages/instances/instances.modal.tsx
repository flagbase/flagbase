import { Modal, Typography } from 'antd'
import React, { useContext } from 'react'
import { Instance, InstanceContext } from '../../context/instance'
import { fetchAccessToken } from '../workspaces/api'
import { ReactState } from '../workspaces/modal'
import { ModalLayout } from '../../../components/layout'
import { axios } from '../../lib/axios'
import { Field, Form, Formik, FormikHelpers, useFormikContext } from 'formik'
import { InstanceSchema } from './instances.constants'
import Input from '../../../components/input'
import Button from '../../../components/button/button'
import { useMutation, useQuery, useQueryClient } from 'react-query'

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
    const addInstance = async (instance: OmittedInstance) => {
        axios.defaults.baseURL = instance.connectionString
        const result = await fetchAccessToken(instance.connectionString, instance.accessKey, instance.accessSecret)
        const currInstances = JSON.parse(localStorage.getItem('instances') || '[]')
        localStorage.setItem(
            'instances',
            JSON.stringify([
                ...currInstances,
                {
                    ...instance,
                    expiresAt: result.expiresAt,
                    id: result.id,
                },
            ])
        )
        return { ...instance, expiresAt: result.expiresAt }
    }

    const queryClient = useQueryClient()

    const mutation = useMutation(addInstance, {
        onSuccess: (result) => {
            queryClient.invalidateQueries('instances')
            queryClient.setQueryData('instances', (old: any) => [result])
            setVisible(false)
        },
        onError: (error: any) => {
            Modal.error({
                title: 'Could not add this instance',
                content: `Did you make sure you added the correct key and secret? Error: ${error}`,
            })
        },
    })

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
            onSubmit={(values: OmittedInstance, { setSubmitting }: FormikHelpers<OmittedInstance>) => {
                console.log('submitting')
                mutation.mutate(values)
                setSubmitting(false)
            }}
            validationSchema={InstanceSchema}
        >
            {({ errors, touched }) => <InstanceForm visible={visible} setVisible={setVisible} errors={errors} />}
        </Formik>
    )
}
