import React from "react";

import {
  Button,
  Input,
  TagInput,
  Notification,
  Modal,
  Heading,
} from "@flagbase/ui";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { Form, Formik } from "formik";
import { useMutation, useQueryClient } from "react-query";

import { createSdkKey, CreateSdkKeyRequest, deleteSdk, updateSdk } from "./api";
import { configureAxios } from "../../lib/axios";
import { useFlagbaseParams } from "../../lib/use-flagbase-params";
import { getSdkKey } from "../../router/loaders";
import { ReactState } from "../workspaces/workspace.modal";

export const useUpdateSdk = () => {
  const queryClient = useQueryClient();
  const { workspaceKey, projectKey, environmentKey, instanceKey } =
    useFlagbaseParams();
  const mutation = useMutation({
    mutationFn: async (values: {
      id: string;
      description: string;
      tags: string[];
      enabled: boolean;
    }) => {
      if (!instanceKey || !workspaceKey || !projectKey || !environmentKey) {
        return;
      }
      await configureAxios(instanceKey);
      await updateSdk({
        workspaceKey,
        projectKey,
        environmentKey,
        sdkId: values.id,
        body: [
          {
            op: "replace",
            path: "/description",
            value: values.description,
          },
          {
            op: "replace",
            path: "/tags",
            value: values.tags,
          },
          {
            op: "replace",
            path: "/enabled",
            value: values.enabled,
          },
        ],
      });
    },
    onSuccess: () => {
      if (!instanceKey || !workspaceKey || !projectKey || !environmentKey) {
        return;
      }
      queryClient.invalidateQueries({
        queryKey: getSdkKey({
          instanceKey,
          workspaceKey,
          projectKey,
          environmentKey,
        }),
      });
    },
  });

  return mutation;
};

export const useRemoveSdk = () => {
  const { instanceKey, workspaceKey, environmentKey, projectKey } =
    useFlagbaseParams();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (key: string) => {
      await configureAxios(instanceKey!);

      return deleteSdk({
        workspaceKey: workspaceKey!,
        projectKey: projectKey!,
        environmentKey: environmentKey!,
        sdkId: key,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getSdkKey({
          instanceKey: instanceKey!,
          workspaceKey: workspaceKey!,
          projectKey: projectKey!,
          environmentKey: environmentKey!,
        }),
      });
    },
  });

  return mutation;
};

export const useAddSdk = () => {
  const { instanceKey, workspaceKey, environmentKey, projectKey } =
    useFlagbaseParams();
  const queryClient = useQueryClient();

  return useMutation(
    (sdk: CreateSdkKeyRequest) =>
      createSdkKey({
        workspaceKey: workspaceKey!,
        projectKey: projectKey!,
        environmentKey: environmentKey!,
        body: {
          name: sdk.name,
          tags: sdk.tags,
          description: sdk.description,
          enabled: true,
        },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          getSdkKey({
            instanceKey: instanceKey!,
            workspaceKey: workspaceKey!,
            projectKey: projectKey!,
            environmentKey: environmentKey!,
          })
        );
      },
    }
  );
};

export const CreateSDKModal = ({ visible, setVisible }: ReactState) => {
  const { workspaceKey, projectKey, environmentKey } = useFlagbaseParams();
  const { mutate, isError, isSuccess } = useAddSdk();
  if (!workspaceKey || !projectKey || !environmentKey) {
    return null;
  }

  return (
    <>
      <Notification
        type="error"
        title="Could not add this instance"
        content="Did you make sure you added the correct key and secret?"
        show={isError}
      />
      <Notification
        type="success"
        title="Successfully added this instance"
        content="You can now manage your flags"
        show={isSuccess}
      />
      <Modal open={visible} onClose={() => setVisible(false)}>
        <div className="flex flex-col gap-3">
          <div className="text-center">
            <Heading>Add a new SDK</Heading>
          </div>
          <Formik
            initialValues={
              {
                name: "",
                description: "",
                tags: [],
              } as CreateSdkKeyRequest
            }
            onSubmit={async (values) => {
              mutate(values);
              setVisible(false);
            }}
          >
            {({ errors }) => (
              <Form className="flex flex-col gap-3">
                <Input
                  id="name"
                  name="name"
                  label="Name"
                  placeholder="sdk-name"
                />
                <Input
                  id="description"
                  name="description"
                  label="Description"
                  placeholder="SDK Description"
                />

                <TagInput id="tags" name="tags" label="Tags" />
                <Button
                  type="submit"
                  className="mt-3 justify-center py-2"
                  suffix={PlusCircleIcon}
                >
                  Add SDK
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </>
  );
};
