import React, { useEffect } from 'react';

import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Typography } from 'antd';
import { Form, Formik } from 'formik';

import { NewWorkspaceSchema } from './workspace.constants';
import { useAddWorkspace } from './workspaces.main';
import Button from '../../../components/button';
import Input from '../../../components/input';
import { TagInput } from '../../../components/input/tag-input';
import { ModalLayout } from '../../../components/layout';
import { useNotification } from '../../hooks/use-notification';
import { Instance } from '../instances/instances.functions';

const { Title, Text } = Typography;

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
    <ModalLayout open={visible} onClose={() => setVisible(false)}>
      <>
        <div className="text-center">
          <Title level={3}>Add a new workspace</Title>
          <Text>
            Connect to a Flagbase workspace to begin managing your flags
          </Text>
        </div>
        <div className="flex flex-col gap-3 mt-3">
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
                  className="mt-3 py-2 justify-center"
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
    </ModalLayout>
  );
};

export { CreateWorkspaceModal, ReactState };
