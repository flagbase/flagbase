import React from 'react';

import { Button, Input, Notification, EditEntityHeading } from '@flagbase/ui';
import { Field, Form, Formik } from 'formik';
import { useQueryClient, useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { deleteVariation, updateVariation, VariationUpdateBody } from './api';
import { Variation } from './variations';
import { useVariations } from './variations.hooks';
import { TagInput } from '../../components/molecules/form/tag-input';
import { configureAxios } from '../../lib/axios';
import { useFlagbaseParams } from '../../lib/use-flagbase-params';
import { getVariationKey } from '../../router/loaders';

export const useUpdateVariation = () => {
  const queryClient = useQueryClient();
  const { instanceKey, flagKey, workspaceKey, projectKey, variationKey } =
    useFlagbaseParams();
  const mutation = useMutation({
    mutationFn: async ({
      initialValues,
      newValues,
    }: {
      initialValues: VariationUpdateBody;
      newValues: VariationUpdateBody;
    }) => {
      if (
        !instanceKey ||
        !workspaceKey ||
        !projectKey ||
        !flagKey ||
        !variationKey
      ) {
        return;
      }
      await configureAxios(instanceKey);
      await updateVariation(
        {
          flagKey: flagKey,
          variationKey: variationKey,
          workspaceKey: workspaceKey,
          projectKey: projectKey,
        },
        initialValues,
        newValues,
      );
    },
    onSuccess: async () => {
      if (
        !instanceKey ||
        !workspaceKey ||
        !projectKey ||
        !flagKey ||
        !variationKey
      ) {
        return;
      }
      await queryClient.invalidateQueries({
        queryKey: getVariationKey({
          instanceKey,
          workspaceKey,
          projectKey,
          flagKey,
          variationKey,
        }),
      });
    },
  });

  return mutation;
};

export const useRemoveVariation = () => {
  const { instanceKey, workspaceKey, projectKey, flagKey, variationKey } =
    useFlagbaseParams();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (variationKey: string) => {
      if (
        !instanceKey ||
        !workspaceKey ||
        !projectKey ||
        !flagKey ||
        !variationKey
      ) {
        return;
      }
      await deleteVariation({
        workspaceKey,
        projectKey,
        flagKey,
        variationKey,
      });
    },
    onSuccess: async () => {
      if (
        !instanceKey ||
        !workspaceKey ||
        !projectKey ||
        !flagKey ||
        !variationKey
      ) {
        return;
      }
      await queryClient.invalidateQueries({
        queryKey: getVariationKey({
          instanceKey,
          workspaceKey,
          projectKey,
          flagKey,
          variationKey,
        }),
      });
    },
  });

  return mutation;
};

const convertVariationResponseToRequest = (variation: Variation) => {
  return {
    name: variation.attributes.name,
    key: variation.attributes.key,
    description: variation.attributes.description,
    tags: variation.attributes.tags,
  };
};

const VariationSettings = () => {
  const { instanceKey, workspaceKey, projectKey, variationKey } =
    useFlagbaseParams();
  const { data: variations } = useVariations();
  const variation = variations?.find(
    (variation) =>
      variation.attributes.key === variationKey?.toLocaleLowerCase(),
  );
  const navigate = useNavigate();

  if (!instanceKey || !workspaceKey || !projectKey) {
    throw new Error('Missing required params');
  }

  const { mutate: remove } = useRemoveVariation();
  const { mutate: update, isSuccess, error } = useUpdateVariation();

  const deleteVariation = () => {
    if (!variationKey) {
      return;
    }
    remove(variationKey);
    navigate(-1);
  };

  if (!variation) {
    return null;
  }

  return (
    <main className="mx-auto max-w-lg px-4 pb-12 pt-10 lg:pb-16">
      <div>
        <EditEntityHeading
          heading="Variation Settings"
          subheading={variationKey}
        />
        <Notification
          type="error"
          show={!!error}
          title={'Error'}
          content={'Something went wrong. Please try again later.'}
        />
        <Notification
          type="success"
          show={!!isSuccess}
          title={'Success'}
          content={'Variation updated successfully!'}
        />
        <Formik
          initialValues={{
            name: variation?.attributes.name,
            key: variation?.attributes.key,
            description: variation?.attributes.description,
            tags: variation?.attributes.tags,
          }}
          onSubmit={(values: {
            key: string;
            name: string;
            description: string;
            tags: string[];
          }) => {
            update({
              initialValues: convertVariationResponseToRequest(variation),
              newValues: values,
            });
          }}
        >
          <Form className="mb-14 flex flex-col gap-5">
            <Field as={Input} name="name" label="Variation Name" />
            <Field as={Input} name="key" label="Key" />
            <Field as={Input} name="description" label="Description" />
            <Field as={TagInput} name="tags" label="Tags" />

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
              Remove this variation
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>This will permanently delete this variation</p>
            </div>
            <div className="mt-5">
              <button
                onClick={() => deleteVariation()}
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm"
              >
                Delete variation
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VariationSettings;
