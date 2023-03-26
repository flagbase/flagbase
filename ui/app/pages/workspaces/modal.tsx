import { ExclamationCircleOutlined } from '@ant-design/icons'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { Modal, notification, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import React, { useEffect } from 'react'
import Button from '../../../components/button'
import Input from '../../../components/input'
import { TagInput } from '../../../components/input/tag-input'
import { ModalLayout } from '../../../components/layout'
import { Instance } from '../../context/instance'
import { deleteWorkspace } from './api'
import { useAddWorkspace } from './workspaces.main'

const { Title, Text } = Typography

const { confirm } = Modal

interface ReactState {
    visible: boolean
    setVisible(data: boolean): void
}

interface WorkspaceModal {
    visible: boolean
    setVisible(data: boolean): void
    instance: Instance
}

function confirmDeleteWorkspace(workspaceName: string, url: string, workspaceKey: string, accessToken: string) {
    confirm({
        title: `Are you sure you want to delete ${workspaceName}?`,
        icon: <ExclamationCircleOutlined />,
        onOk() {
            deleteWorkspace(url, workspaceKey, accessToken)
        },
        onCancel() {},
    })
}

const CreateWorkspace = ({ visible, setVisible, instance }: WorkspaceModal) => {
    const { mutate: addWorkspace, error } = useAddWorkspace(instance)

    useEffect(() => {
        if (error) {
            notification.error({
                message: 'Error',
                description: 'Could not create workspace',
            })
        }
    }, [error])

    return (
        <ModalLayout open={visible} onClose={() => setVisible(false)}>
            <div className="text-center">
                <Title level={3}>Add a new workspace</Title>
                <Text>Connect to a Flagbase workspace to begin managing your flags</Text>
            </div>
            <div className="flex flex-col gap-3 mt-3">
                <Formik
                    initialValues={{
                        name: '',
                        description: '',
                        tags: [],
                    }}
                    onSubmit={async (values) => {
                        addWorkspace({
                            name: values.name,
                            description: values.description,
                            tags: values.tags,
                        })
                        setVisible(false)
                    }}
                >
                    <Form className="flex flex-col gap-3">
                        <Field component={Input} id="name" name="name" placeholder="Workspace name" />
                        <Field component={Input} id="description" name="description" placeholder="Description" />
                        <Field component={TagInput} id="tags" name="tags" placeholder="Tags (separate by comma)" />
                        <Button className="mt-3 py-2 justify-center" suffix={PlusCircleIcon} type="submit">
                            Add Workspace
                        </Button>
                    </Form>
                </Formik>
            </div>
        </ModalLayout>
    )
}

export { CreateWorkspace, confirmDeleteWorkspace, ReactState }
