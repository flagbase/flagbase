import React from 'react';

import { Form, Formik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';

import {
  useRemoveWorkspace,
  useUpdateWorkspace,
  useWorkspaces,
} from './workspaces.main';
import Button from '../../../components/button/button';
import Input from '../../../components/input/input';
import { TagInput } from '../../../components/input/tag-input';
import { Loader } from '../../../components/loader';
import Notification from '../../../components/notification';
import { EditEntityHeading } from '../../../components/text/heading';

export const EditWorkspace = () => {
  const navigate = useNavigate();
  const { instanceKey, workspaceKey } =
    useParams<{ instanceKey: string; workspaceKey: string }>();
  const workspacesQuery = useWorkspaces(instanceKey, {
    select: (workspaces) =>
      workspaces.filter(
        (workspace) => workspace.attributes.key === workspaceKey,
      ),
  });
  const { mutate: update, error, isSuccess } = useUpdateWorkspace(instanceKey);
  const { mutate: remove } = useRemoveWorkspace(instanceKey);

  const removeWorkspace = () => {
    if (!workspace || !instanceKey) {
      throw new Error('Workspace not found');
    }
    remove(workspace?.attributes.key);
    navigate(`/${instanceKey}/workspaces`);
  };

  if (workspacesQuery.isLoading || workspacesQuery.isIdle) {
    return <Loader />;
  }

  if (workspacesQuery.isError) {
    throw new Error(workspacesQuery.error as string);
  }

  const [workspace] = workspacesQuery.data;

  return (
    <div className="mx-auto max-w-lg px-4 pt-10 pb-12 lg:pb-16">
      {workspacesQuery.status === 'success' && (
        <div>
          <EditEntityHeading
            heading="Workspace Settings"
            subheading={workspace.attributes.key}
          />
          <Notification
            type="error"
            show={!!error}
            title={'Error'}
            content={'Something went wrong. Please try again later.'}
          />
          <Notification
            type="error"
            show={!!isSuccess}
            title={'Success'}
            content={'Workspace updated successfully!'}
          />
          <Formik
            initialValues={{
              name: workspace.attributes.name,
              key: workspace.attributes.key,
              description: workspace.attributes.description,
              tags: workspace.attributes.tags,
            }}
            onSubmit={(values: {
              name: string;
              key: string;
              description: string;
              tags: string[];
            }) => {
              update(values);
            }}
          >
            <Form className="flex flex-col gap-5 mb-14">
              <Input name="name" label="Workspace Name" />
              <Input name="key" label="Workspace Key" />
              <Input name="description" label="Description" />
              <TagInput name="tags" label="Tags" />

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
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
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
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Delete this workspace
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  This operation is irreversible... Make sure you know what
                  you're doing
                </p>
              </div>
              <div className="mt-5">
                <button
                  onClick={removeWorkspace}
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm"
                >
                  Delete workspace
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
