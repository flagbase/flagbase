import React, { Suspense } from 'react';

import { Field, Form, Formik } from 'formik';
import { Await, useLoaderData, useNavigate } from 'react-router-dom';

import { Flag } from './api';
import { useFlags, useRemoveFlag, useUpdateFlag } from './flags';
import Button from '../../../components/button/button';
import { SettingsContainer } from '../../../components/container/SettingsContainer';
import Input from '../../../components/input/input';
import { TagInput } from '../../../components/input/tag-input';
import { Loader } from '../../../components/loader';
import Notification from '../../../components/notification';
import { EditEntityHeading } from '../../../components/text/heading';
import { useFlagbaseParams } from '../../lib/use-flagbase-params';

export const FlagSettings = () => {
  const { instanceKey, workspaceKey, projectKey } = useFlagbaseParams();
  const navigate = useNavigate();
  const { flags: prefetchedFlags } = useLoaderData() as { flags: Flag[] };

  const { flagKey } = useFlagbaseParams();

  const { data: flags, isLoading } = useFlags();
  const { mutate: remove } = useRemoveFlag();
  const { mutate: update, isSuccess, isError } = useUpdateFlag();
  const flag = flags?.find((flag) => flag.attributes.key === flagKey);

  const removeFlag = () => {
    remove();
    navigate(
      `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/flags`,
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!flag) {
    return null;
  }

  return (
    <Suspense fallback={<Loader />}>
      <Await resolve={prefetchedFlags}>
        {() => (
          <SettingsContainer>
            <Notification
              type="success"
              title="Success!"
              content="Flag settings updated successfully"
              show={isSuccess}
            />
            <Notification
              type="error"
              title="Error :("
              content="Could not update SDK"
              show={isError}
            />
            <EditEntityHeading
              heading="Flag Settings"
              subheading={flag.attributes.name}
            />
            <Formik
              initialValues={{
                name: flag.attributes.name,
                key: flag.attributes.key,
                description: flag.attributes.description,
                tags: flag.attributes.tags,
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
              <Form className="flex flex-col gap-3">
                <Input name="name" label="Name" />
                <Input name="key" label="Key" />
                <Input name="description" label="Description" />
                <TagInput name="tags" label="Tags" />
                <div className="flex justify-start gap-3 my-4">
                  <Button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                  >
                    Update
                  </Button>
                </div>
              </Form>
            </Formik>
            <div className="relative my-4">
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
                  Delete this flag
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>This action is permanent</p>
                </div>
                <div className="mt-5">
                  <button
                    onClick={removeFlag}
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm"
                  >
                    Delete Flag
                  </button>
                </div>
              </div>
            </div>
          </SettingsContainer>
        )}
      </Await>
    </Suspense>
  );
};
