import React, { useEffect } from 'react';

import {
  Heading,
  Text,
  Button,
  Input,
  Modal,
  useNotification,
} from '@flagbase/ui';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Form, Formik } from 'formik';

import { NewWorkspaceSchema } from './workspace.constants';
import { useAddWorkspace } from './workspaces.hooks';
import { TagInput } from '../../components/molecules/form/tag-input';
import { Instance } from '../instances/instances.functions';

interface ReactState {
  visible: boolean;
  setVisible(data: boolean): void;
}

interface WorkspaceModal {
  visible: boolean;
  setVisible(data: boolean): void;
  instance: Instance;
}

const CreateWorkspaceModal = ({ visible, setVisible }: WorkspaceModal) => {
  const { addNotification } = useNotification();
  const {
    mutate: addWorkspace,
    error,
    isLoading,
    isSuccess,
  } = useAddWorkspace();

  useEffect(() => {
    if (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        content: 'Could not create workspace',
      });
    }
    if (isSuccess) {
      addNotification({
        type: 'success',
        title: 'Success',
        content: 'Workspace created successfully',
      });
      setVisible(false);
    }
  }, [error, isSuccess, setVisible]);

  return (
    <Modal open={visible} onClose={() => setVisible(false)}>
      <>
        <div className="text-center">
          <Heading className="mb-2" level={3}>
            Add a new workspace
          </Heading>
          <Text>
            Connect to a Flagbase workspace to begin managing your flags
          </Text>
        </div>
        <div className="mt-3 flex flex-col gap-3">
          <Formik
            validateOnMount
            initialValues={{
              name: '',
              description: '',
              tags: [],
            }}
            onSubmit={(values) => {
              addWorkspace({
                name: values.name,
                description: values.description,
                tags: values.tags,
              });
            }}
            validationSchema={NewWorkspaceSchema}
          >
            {({ isValid }) => (
              <Form className="flex flex-col gap-3">
                <Input id="name" name="name" label="Workspace name" />
                <Input
                  id="description"
                  name="description"
                  label="Description"
                />
                <TagInput
                  id="tags"
                  name="tags"
                  label="Tags (separate by comma)"
                />
                <Button
                  isLoading={isLoading}
                  disabled={!isValid}
                  className="mt-3 justify-center py-2"
                  suffix={PlusCircleIcon}
                  type="submit"
                >
                  Add Workspace
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </>
    </Modal>
  );
};

export { CreateWorkspaceModal, ReactState };
