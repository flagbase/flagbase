import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import React, { Dispatch, SetStateAction } from 'react'
import Button from '../../../components/button'
import Input from '../../../components/input'
import { TagInput } from '../../../components/input/tag-input'
import { ModalLayout } from '../../../components/layout'
import { useFlagbaseParams } from '../../lib/use-flagbase-params'
import { useAddProject } from './projects'

const { Title, Text } = Typography

interface WorkspaceModal {
    visible: boolean
    setVisible(data: boolean): void
}

const CreateProjectModal: React.FC<{ visible: boolean; setVisible: Dispatch<SetStateAction<boolean>> }> = ({
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
                    <Text>Create a new project! A project allows you to organise your flags, segments etc.</Text>
                </div>
                <Formik
                    initialValues={{
                        name: '',
                        description: '',
                        tags: [],
                    }}
                    onSubmit={async (values) => {
                        mutation.mutate({
                            name: values.name,
                            description: values.description,
                            tags: values.tags,
                        })
                        setVisible(false)
                    }}
                >
                    <Form className="flex flex-col gap-3">
                        <Field component={Input} id="name" name="name" placeholder="Project name" />
                        <Field component={Input} id="description" name="description" placeholder="Description" />
                        <Field component={TagInput} id="tags" name="tags" placeholder="Tags (separate by comma)" />
                        <Button className="mt-3 py-2 justify-center" type="submit" suffix={PlusCircleIcon}>
                            Add Project
                        </Button>
                    </Form>
                </Formik>
            </div>
        </ModalLayout>
    )
}

export { CreateProjectModal }
