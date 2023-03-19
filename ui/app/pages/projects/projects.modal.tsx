import { ExclamationCircleOutlined } from '@ant-design/icons'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { Modal, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import React, { Dispatch, SetStateAction } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../../../components/button'
import Input from '../../../components/input'
import { ModalLayout } from '../../../components/layout'
import { useFlagbaseParams } from '../../lib/use-flagbase-params'
import { deleteProject } from './api'
import { useAddProject } from './projects'

const { Title, Text } = Typography
const { confirm } = Modal

interface WorkspaceModal {
    visible: boolean
    setVisible(data: boolean): void
}

function confirmDeleteProject(workspaceName: string, url: string, workspaceKey: string, accessToken: string) {
    confirm({
        title: `Are you sure you want to delete ${workspaceName}?`,
        icon: <ExclamationCircleOutlined />,
        onOk() {
            deleteProject(url, workspaceKey, accessToken)
        },
        onCancel() {},
    })
}

const CreateProject: React.FC<{ visible: boolean; setVisible: Dispatch<SetStateAction<boolean>> }> = ({
    visible,
    setVisible,
}: WorkspaceModal) => {
    const { instanceKey, workspaceKey } = useFlagbaseParams()

    const mutation = useAddProject(instanceKey, workspaceKey)

    return (
        <ModalLayout open={visible} onClose={() => setVisible(false)}>
            <div className="flex flex-col gap-3">
                <div className="text-center">
                    <Title level={3}>Add a new project</Title>
                    <Text>Connect to a Flagbase project to begin managing your flags</Text>
                </div>
                <Formik
                    initialValues={{
                        name: '',
                        description: '',
                        tags: '',
                    }}
                    onSubmit={async (values) => {
                        mutation.mutate({
                            name: values.name,
                            description: values.description,
                            tags: values.tags.split(','),
                        })
                        setVisible(false)
                    }}
                >
                    <Form className="flex flex-col gap-3">
                        <Field component={Input} id="name" name="name" placeholder="Project name" />
                        <Field component={Input} id="description" name="description" placeholder="Description" />
                        <Field component={Input} id="tags" name="tags" placeholder="Tags (separate by comma)" />
                        <Button className="mt-3 py-2 justify-center" type="submit" suffix={PlusCircleIcon}>
                            Add Project
                        </Button>
                    </Form>
                </Formik>
            </div>
        </ModalLayout>
    )
}

export { CreateProject, confirmDeleteProject }
