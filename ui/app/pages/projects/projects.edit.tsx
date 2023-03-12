import { Formik, Field } from 'formik'
import React from 'react'
import { Form, useNavigate } from 'react-router-dom'
import Button from '../../../components/button'
import Input from '../../../components/input'
import { EditEntityHeading } from '../../../components/text/heading'
import { useFlagbaseParams } from '../../lib/use-flagbase-params'
import { useProjects, useRemoveProject } from './projects'

const EditProject = () => {
    const { instanceKey, workspaceKey, projectKey } = useFlagbaseParams()
    const { data: projects } = useProjects(instanceKey, workspaceKey)
    const project = projects?.find((project) => project.attributes.key === projectKey?.toLocaleLowerCase())
    const navigate = useNavigate()

    if (!instanceKey || !workspaceKey || !projectKey) {
        throw new Error('Missing required params')
    }

    const { mutate: remove } = useRemoveProject(instanceKey, workspaceKey)

    if (!project) {
        return null
    }

    const deleteProject = () => {
        remove(projectKey)
        navigate(-1)
    }

    return (
        <main className="mx-auto max-w-lg px-4 pt-10 pb-12 lg:pb-16">
            <div>
                <EditEntityHeading heading="Project Settings" subheading={workspaceKey} />

                <Formik
                    initialValues={{
                        key: project?.attributes.key,
                        description: project?.attributes.description,
                        tags: project?.attributes.tags,
                    }}
                    onSubmit={(values: { key: string; description: string; tags: string[] }) => {}}
                >
                    <Form className="flex flex-col gap-5 mb-14">
                        <Field component={Input} name="key" label="Key" />
                        <Field component={Input} name="description" label="Description" />
                        <Field component={Input} name="tags" label="Tags" />

                        <div className="flex justify-start gap-3">
                            <Button
                                type="submit"
                                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                            >
                                Update
                            </Button>
                        </div>
                    </Form>
                </Formik>

                <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-3 text-base font-semibold leading-6 text-gray-900">
                            Danger Zone
                        </span>
                    </div>
                </div>
                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Remove this project</h3>
                        <div className="mt-2 max-w-xl text-sm text-gray-500">
                            <p>This will permanently delete this project</p>
                        </div>
                        <div className="mt-5">
                            <button
                                onClick={() => deleteProject()}
                                type="button"
                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm"
                            >
                                Delete project
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default EditProject