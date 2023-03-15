import { Field, Form, Formik } from 'formik'
import React, { Suspense } from 'react'
import { Await } from 'react-router-dom'
import { Divider } from '../../../components/divider'
import Input from '../../../components/input/input'
import { Select } from '../../../components/input/select'
import { Loader } from '../../../components/loader'
import { Heading } from '../../../components/text/heading'
import { useFlagbaseParams } from '../../lib/use-flagbase-params'
import { useFlags } from './flags'

export const Targeting = () => {
    const { data: flags } = useFlags()
    const { flagKey } = useFlagbaseParams()
    const flag = flags?.find((flag) => flag.attributes.key === flagKey)

    console.log('flags', flag)

    return (
        <Suspense fallback={<Loader />}>
            <Await resolve={flag}>
                {() => (
                    <div className="mt-5">
                        <Heading className="mb-2">Targeting Rules</Heading>
                        <Divider />
                        <Formik
                            initialValues={{
                                name: flag?.attributes.name,
                                description: flag?.attributes.description,
                                tags: flag?.attributes.tags,
                                key: flag?.attributes.key,
                            }}
                            onSubmit={(values) => {
                                console.log('values', values)
                            }}
                        >
                            <Form>
                                <div className="flex gap-3">
                                    <Field component={Input} name="traitKey" placeholder="Trait Key" />
                                    <Field component={Select} name="operand" placeholder="Trait Key" />
                                    <Field component={Input} name="traitValue" placeholder="Trait Value" />
                                </div>
                            </Form>
                        </Formik>
                    </div>
                )}
            </Await>
        </Suspense>
    )
}
