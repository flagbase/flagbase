import React, { useState } from 'react';

import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { VariationCreateBody } from './api';
import { useAddVariation } from './variations';
import Button from '../../../components/button';
import Input from '../../../components/input';
import { KeyInput } from '../../../components/input/input';
import { TagInput } from '../../../components/input/tag-input';
import { ModalLayout } from '../../../components/layout';
import { Heading } from '../../../components/text/heading';
import Text from '../../../components/text/text';

const CreateVariation = () => {
  const mutation = useAddVariation();
  const [visible, setVisible] = useState(false);

  return (
    <>
      <ModalLayout open={visible} onClose={() => setVisible(false)}>
        <div className="flex flex-col gap-3">
          <div className="text-center">
            <Heading>Add a new variation</Heading>
            <Text>
              Create a new variation. You can add as many feature variations as
              you want!
            </Text>
          </div>
          <Formik
            initialValues={
              {
                key: '',
                name: '',
                description: '',
                tags: [],
              } as VariationCreateBody
            }
            onSubmit={async (values) => {
              await mutation.mutateAsync({
                name: values.name,
                key: values.key,
                description: values.description,
                tags: values.tags,
              });
              setVisible(false);
            }}
            validationSchema={Yup.object({
              key: Yup.string().required('Required').min(3, 'Too short'),
              name: Yup.string().required('Required').min(3, 'Too short'),
              description: Yup.string().optional(),
              tags: Yup.array().of(Yup.string()),
            })}
            validateOnMount
          >
            <Form className="flex flex-col gap-3">
              <Input id="name" name="name" label="Variation name" />
              <KeyInput id="key" name="key" label="Key" />
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
              >
                Add variation
              </Button>
            </Form>
          </Formik>
        </div>
      </ModalLayout>
      <Button
        className="py-2"
        onClick={() => setVisible(true)}
        suffix={PlusCircleIcon}
      >
        Add Variation
      </Button>
    </>
  );
};

export { CreateVariation };
