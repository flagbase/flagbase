import React, { Dispatch, SetStateAction } from 'react';

import { Button, Input, TagInput, Modal, Text, Heading } from '@flagbase/ui';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Form, Formik } from 'formik';

import { FlagCreateBody } from './api';
import { useAddFlag } from './flags.hooks';

export interface ModalProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const CreateFlag: React.FC<{
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}> = ({ visible, setVisible }: ModalProps) => {
  const mutation = useAddFlag();

  return (
    <Modal open={visible} onClose={() => setVisible(false)}>
      <div className="flex flex-col gap-3">
        <div className="text-center">
          <Heading>Add a new flag</Heading>
          <Text>
            Create a new feature flag, before referencing it in your code
          </Text>
        </div>
        <Formik
          initialValues={
            {
              key: '',
              name: '',
              description: '',
              tags: [],
            } as FlagCreateBody
          }
          onSubmit={async (values) => {
            mutation.mutate({
              key: values.key,
              name: values.name,
              description: values.description,
              tags: values.tags,
            });
            setVisible(false);
          }}
        >
          <Form className="flex flex-col gap-3">
            <Input id="name" name="name" label="Flag name" />
            {/* <KeyInput id="key" name="key" label="Key" /> */}
            <Input id="description" name="description" label="Description" />
            <TagInput id="tags" name="tags" label="Tags (separate by comma)" />
            <Button
              className="mt-3 justify-center py-2"
              type="submit"
              suffix={PlusCircleIcon}
            >
              Add Flag
            </Button>
          </Form>
        </Formik>
      </div>
    </Modal>
  );
};

export { CreateFlag };
