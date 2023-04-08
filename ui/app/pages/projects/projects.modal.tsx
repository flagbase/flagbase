import React, { Dispatch, SetStateAction, useEffect } from 'react';

import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Typography } from 'antd';
import { Form, Formik } from 'formik';

import { useAddProject } from './projects';
import { NewProjectSchema } from './projects.constants';
import Button from '../../../components/button';
import Input from '../../../components/input';
import { TagInput } from '../../../components/input/tag-input';
import { ModalLayout } from '../../../components/layout';
import { useNotification } from '../../hooks/use-notification';

const { Title, Text } = Typography;

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
    <ModalLayout open={visible} onClose={() => setVisible(false)}>
      <div className="flex flex-col gap-3">
        <div className="text-center">
          <Title level={3}>Add a new project</Title>
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
              <Input id="name" name="name" label="Project name" />
              <Input id="description" name="description" label="Description" />
              <TagInput
                id="tags"
                name="tags"
                label="Tags (separate by comma)"
              />
              <Button
                className="mt-3 py-2 justify-center"
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
    </ModalLayout>
  );
};

export { CreateProjectModal };
