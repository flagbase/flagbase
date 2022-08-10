import { Input, Modal, Typography } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React, { useContext } from 'react'
import { Instance, InstanceContext } from '../../context/instance'
import { fetchAccessToken } from '../workspaces/api'
import { ReactState } from '../workspaces/modal'
import { ModalLayout } from '../../../components/layout'
import { axios } from '../../lib/axios'
import { Field, Form, Formik, FormikHelpers, useFormikContext } from 'formik'
import { InstanceSchema } from './instances.constants'

type OmittedInstance = Omit<Instance, 'expiresAt'>

const InstanceForm = ({ visible, setVisible, errors }: ReactState & { errors: any }) => {
    const { Title, Text } = Typography
    const { submitForm } = useFormikContext<OmittedInstance>()
    console.log('ERRS', errors)
    return (
        <>
            <Modal visible={visible} okText="Submit" onOk={() => submitForm()} onCancel={() => setVisible(false)}>
                <ModalLayout>
                    <Content>
                        <Title level={3}>Add a new instance</Title>
                        <Text>Connect to a Flagbase instance to begin managing your flags</Text>
                        <Form>
                            <Field component={Input} id="key" name="key" placeholder="Instance Name" />
                            <Field component={Input} id="connectionString" name="connectionString" placeholder="URL" />
                            <Field component={Input} id="accessKey" name="accessKey" placeholder="Access Key" />
                            <Field
                                component={Input.Password}
                                id="accessSecret"
                                name="accessSecret"
                                placeholder="Access Secret"
                            />
                        </Form>
                    </Content>
                </ModalLayout>
            </Modal>
        </>
    )
}

export const AddNewInstanceModal = ({ visible, setVisible }: ReactState) => {
    const { addEntity } = useContext(InstanceContext)
    const addInstance = (instance: OmittedInstance) => {
        axios.defaults.baseURL = instance.connectionString
        fetchAccessToken(instance.connectionString, instance.accessKey, instance.accessSecret)
            .then((result) => {
                addEntity({ ...instance, id: result.id, accessToken: result.token, expiresAt: result.expiresAt })
                setVisible(false)
            })
            .catch(() => {
                Modal.error({
                    title: 'Could not add this instance',
                    content: 'Did you make sure you added the correct key and secret?',
                })
            })
    }
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
                addInstance(values)
                setSubmitting(false)
            }}
            validationSchema={InstanceSchema}
        >
            {({ errors, touched }) => <InstanceForm visible={visible} setVisible={setVisible} errors={errors} />}
        </Formik>
    )
}
