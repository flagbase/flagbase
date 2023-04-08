import React, { Dispatch, SetStateAction } from 'react';

import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Field, Form, Formik } from 'formik';

import { FlagCreateBody } from './api';
import { useAddFlag } from './flags';
import Button from '../../../components/button';
import Input from '../../../components/input';
import { KeyInput } from '../../../components/input/input';
import { TagInput } from '../../../components/input/tag-input';
import { ModalLayout } from '../../../components/layout';
import { Heading } from '../../../components/text/heading';
import Text from '../../../components/text/text';

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
    <ModalLayout open={visible} onClose={() => setVisible(false)}>
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
            <KeyInput id="key" name="key" label="Key" />
            <Input id="description" name="description" label="Description" />
            <TagInput id="tags" name="tags" label="Tags (separate by comma)" />
            <Button
              className="mt-3 py-2 justify-center"
              type="submit"
              suffix={PlusCircleIcon}
            >
              Add Flag
            </Button>
          </Form>
        </Formik>
      </div>
    </ModalLayout>
  );
};

export { CreateFlag };
