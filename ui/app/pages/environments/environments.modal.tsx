import { useFeatureFlag } from '@flagbase/react-client-sdk'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { Field, Form, Formik } from 'formik'
import React, { useState } from 'react'
import Button from '../../../components/button'
import Input from '../../../components/input'
import { KeyInput } from '../../../components/input/input'
import { TagInput } from '../../../components/input/tag-input'
import { ModalLayout } from '../../../components/layout'
import { Heading } from '../../../components/text/heading'
import Text from '../../../components/text/text'
import { EnvironmentCreateBody } from './api'
import { useAddEnvironment } from './environments'

const CreateEnvironment = () => {
    const showFeature = useFeatureFlag("create-environment-button", "control");

    const mutation = useAddEnvironment()
    const [visible, setVisible] = useState(false)

    return showFeature === "treatment" ? (
        <>
            <ModalLayout open={visible} onClose={() => setVisible(false)}>
                <div className="flex flex-col gap-3">
                    <div className="text-center">
                        <Heading>Add a new environment</Heading>
                        <Text>Create a new environment. An environment isolates changes you make when updating your flags or segments.</Text>
                    </div>
                    <Formik
                        initialValues={
                            {
                                key: '',
                                name: '',
                                description: '',
                                tags: [],
                            } as EnvironmentCreateBody
                        }
                        onSubmit={async (values) => {
                            mutation.mutate({
                                key: values.key,
                                name: values.name,
                                description: values.description,
                                tags: values.tags,
                            })
                            setVisible(false)
                        }}
                    >
                        <Form className="flex flex-col gap-3">
                            <Field component={Input} id="name" name="name" placeholder="Environment name" />
                            <Field component={KeyInput} id="key" name="key" placeholder="Key" />
                            <Field component={Input} id="description" name="description" placeholder="Description" />
                            <Field component={TagInput} id="tags" name="tags" placeholder="Tags (separate by comma)" />
                            <Button className="mt-3 py-2 justify-center" type="submit" suffix={PlusCircleIcon}>
                                Add environment
                            </Button>
                        </Form>
                    </Formik>
                </div>
            </ModalLayout>
            <Button className="py-2" onClick={() => setVisible(true)} suffix={PlusCircleIcon}>
                Add Environment
            </Button>
        </>
    ) : null
}

export { CreateEnvironment }
