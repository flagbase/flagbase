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
import { VariationCreateBody } from './api'
import { useAddVariation } from './variations'

const CreateVariation = () => {
    const mutation = useAddVariation()
    const [visible, setVisible] = useState(false)

    return (
        <>
            <ModalLayout open={visible} onClose={() => setVisible(false)}>
                <div className="flex flex-col gap-3">
                    <div className="text-center">
                        <Heading>Add a new variation</Heading>
                        <Text>Connect to a Flagbase project to begin managing your flags</Text>
                    </div>
                    <Formik
                        initialValues={
                            {
                                key: '',
                                name: '',
                                description: '',
                                tags: [],
                            } as VariationCreateBody
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
                            <Field component={Input} id="name" name="name" placeholder="Variation name" />
                            <Field component={KeyInput} id="key" name="key" placeholder="Key" />
                            <Field component={Input} id="description" name="description" placeholder="Description" />
                            <Field component={TagInput} id="tags" name="tags" placeholder="Tags (separate by comma)" />
                            <Button className="mt-3 py-2 justify-center" type="submit" suffix={PlusCircleIcon}>
                                Add variation
                            </Button>
                        </Form>
                    </Formik>
                </div>
            </ModalLayout>
            <Button className="py-2" onClick={() => setVisible(true)} suffix={PlusCircleIcon}>
                Add Variation
            </Button>
        </>
    )
}

export { CreateVariation }
