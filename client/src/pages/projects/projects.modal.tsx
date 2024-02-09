import React, { Dispatch, SetStateAction, useEffect } from 'react';

import {
  Button,
  Input,
  Modal,
  Text,
  Heading,
  useNotification,
} from '@flagbase/ui';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Field, Form, Formik } from 'formik';

import { NewProjectSchema } from './projects.constants';
import { useAddProject } from './projects.hooks';
import { TagInput } from '../../components/molecules/form/tag-input';

interface WorkspaceModal {
  visible: boolean;
  setVisible(data: boolean): void;
}

const CreateProjectModal: React.FC<{
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}> = ({ visible, setVisible }: WorkspaceModal) => {
  const mutation = useAddProject();
  const { addNotification } = useNotification();

  useEffect(() => {
    if (mutation.isSuccess) {
      setVisible(false);
    }
    if (mutation.isError) {
      addNotification({
        type: 'error',
        title: 'Error',
        content: mutation.error,
      });
    }
  }, [mutation.isError, mutation.isSuccess, setVisible]);

  return (
    <Modal open={visible} onClose={() => setVisible(false)}>
      <div className="flex flex-col gap-3">
        <div className="text-center">
          <Heading level={3}>Add a new project</Heading>

          <Text>
            A project allows you to organise your flags, segments etc.
          </Text>
        </div>
        <Formik
          initialValues={{
            name: '',
            description: '',
            tags: [],
          }}
          onSubmit={async (values) => {
            mutation.mutate({
              name: values.name,
              description: values.description,
              tags: values.tags,
            });
          }}
          validateOnMount
          validationSchema={NewProjectSchema}
        >
          {({ isValid }) => (
            <Form className="flex flex-col gap-3">
              <Field as={Input} id="name" name="name" label="Project name" />
              <Field as={Input} id="description" name="description" label="Description" />
              <Field as={TagInput}
                id="tags"
                name="tags"
                label="Tags (separate by comma)"
              />
              <Button
                className="mt-3 justify-center py-2"
                type="submit"
                suffix={PlusCircleIcon}
                isLoading={mutation.isLoading}
                disabled={!isValid}
              >
                Add Project
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export { CreateProjectModal };
