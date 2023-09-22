import React, { Suspense } from 'react';

import {
  Button,
  Input,
  SettingsContainer,
  Loader,
  Notification,
  EditEntityHeading,
} from '@flagbase/ui';
import { Field, Form, Formik } from 'formik';
import { Await, useLoaderData, useNavigate } from 'react-router-dom';

import { SDK } from './api';
import { useSDKs } from './sdks';
import { useRemoveSdk, useUpdateSdk } from './sdks.modal';
import { TagInput } from '../../components/molecules/form/tag-input';
import Toggle from '../../components/molecules/form/toggle/toggle';
import { useFlagbaseParams } from '../../lib/use-flagbase-params';

export const SdkSettings = () => {
  const navigate = useNavigate();
  const { sdks: prefetchedSdks } = useLoaderData() as { sdks: SDK[] };
  const { instanceKey, workspaceKey, projectKey, sdkKey, environmentKey } =
    useFlagbaseParams();

  const { data: sdks, isLoading } = useSDKs();
  const { mutate: remove } = useRemoveSdk();
  const { mutate: update, isSuccess, isError } = useUpdateSdk();
  const sdk = sdks?.find((sdk) => sdk.id === sdkKey);

  const removeSdk = () => {
    if (!sdk) {
      return;
    }
    remove(sdk.id);
    navigate(
      `/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/environments/${environmentKey}/sdk-keys`,
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!sdk) {
    return null;
  }

  return (
    <Suspense fallback={<Loader />}>
      <Await resolve={prefetchedSdks}>
        {() => (
          <SettingsContainer>
            <Notification
              type="success"
              title="Success!"
              content="SDK settings updated successfully"
              show={isSuccess}
            />
            <Notification
              type="error"
              title="Error :("
              content="Could not update SDK"
              show={isError}
            />
            <EditEntityHeading
              heading="SDK Settings"
              subheading={sdk?.attributes.name}
            />
            <Formik
              initialValues={{
                id: sdk.id,
                name: sdk.attributes.name,
                description: sdk.attributes.description,
                enabled: sdk.attributes.enabled,
                clientKey: sdk.attributes.clientKey,
                serverKey: sdk.attributes.serverKey,
                tags: sdk.attributes.tags,
              }}
              onSubmit={(values: {
                id: string;
                enabled: boolean;
                clientKey: string;
                serverKey: string;
                description: string;
                tags: string[];
              }) => {
                update(values);
              }}
            >
              <Form className="flex flex-col gap-3">
                <Field component={Input} name="name" label="Name" />
                <Field
                  component={Input}
                  name="description"
                  label="Description"
                />

                <Field
                  component={Input}
                  name="clientKey"
                  label="Client Key"
                  disabled
                />
                <Field
                  component={Input}
                  name="serverKey"
                  label="Server Key"
                  disabled
                />
                <Field component={TagInput} name="tags" label="Tags" disabled />
                <Field
                  component={Toggle}
                  type="checkbox"
                  name="enabled"
                  label="Enabled"
                />
                <div className="flex justify-start gap-3">
                  <Button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
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
                  Delete this SDK
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>This action is permanent</p>
                </div>
                <div className="mt-5">
                  <button
                    onClick={removeSdk}
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm"
                  >
                    Delete SDK
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
