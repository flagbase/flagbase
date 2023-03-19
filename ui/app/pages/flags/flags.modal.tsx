import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { Field, Form, Formik } from 'formik'
import React, { Dispatch, SetStateAction } from 'react'
import Button from '../../../components/button'
import Input from '../../../components/input'
import { KeyInput } from '../../../components/input/input'
import { ModalLayout } from '../../../components/layout'
import { Heading } from '../../../components/text/heading'
import Text from '../../../components/text/text'
import { FlagCreateBody } from './api'
import { useAddFlag } from './flags'

interface WorkspaceModal {
    visible: boolean
    setVisible(data: boolean): void
}

const CreateFlag: React.FC<{ visible: boolean; setVisible: Dispatch<SetStateAction<boolean>> }> = ({
    visible,
    setVisible,
}: WorkspaceModal) => {
    const mutation = useAddFlag()

    return (
        <ModalLayout open={visible} onClose={() => setVisible(false)}>
            <div className="flex flex-col gap-3">
                <div className="text-center">
                    <Heading>Add a new flag</Heading>
                    <Text>Connect to a Flagbase project to begin managing your flags</Text>
                </div>
                <Formik
                    initialValues={
                        {
                            key: '',
                            name: '',
                            description: '',
                            tags: '',
                        } as FlagCreateBody
                    }
                    onSubmit={async (values) => {
                        mutation.mutate({
                            key: values.key,
                            name: values.name,
                            description: values.description,
                            tags: values.tags?.split(','),
                        })
                        setVisible(false)
                    }}
                >
                    <Form className="flex flex-col gap-3">
                        <Field component={Input} id="name" name="name" placeholder="Flag name" />
                        <Field component={KeyInput} id="key" name="key" placeholder="Key" />
                        <Field component={Input} id="description" name="description" placeholder="Description" />
                        <Field component={Input} id="tags" name="tags" placeholder="Tags (separate by comma)" />
                        <Button className="mt-3 py-2 justify-center" type="submit" suffix={PlusCircleIcon}>
                            Add Flag
                        </Button>
                    </Form>
                </Formik>
            </div>
        </ModalLayout>
    )
}

export { CreateFlag }
