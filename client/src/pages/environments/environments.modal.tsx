import React, { useState } from 'react';

import { useFeatureFlag } from '@flagbase/react-client-sdk';
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
import * as Yup from 'yup';

import { EnvironmentCreateBody } from './api';
import { useAddEnvironment } from './environments';
import { TagInput } from '../../components/molecules/form/tag-input';

const NewEnvironmentSchema = Yup.object().shape({
  key: Yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  name: Yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  description: Yup.string().optional(),
  tags: Yup.array().of(Yup.string()),
});

const CreateEnvironment = () => {
  const showFeature = useFeatureFlag('create-environment-button', 'control');
  const { addNotification } = useNotification();
  const mutation = useAddEnvironment();
  const [visible, setVisible] = useState(false);

  return showFeature === 'treatment' ? (
    <>
      <Modal open={visible} onClose={() => setVisible(false)}>
        <div className="flex flex-col gap-3">
          <div className="text-center">
            <Heading>Add a new environment</Heading>
            <Text>
              An environment isolates changes you make when updating your flags
              or segments.
            </Text>
          </div>
          <Formik
            initialValues={
              {
                key: '',
                name: '',
                description: '',
                tags: [],
              } as EnvironmentCreateBody
            }
            onSubmit={async (values) => {
              const result = await mutation.mutateAsync({
                key: values.key,
                name: values.name,
                description: values.description,
                tags: values.tags,
              });
              setVisible(false);
              addNotification({
                type: 'success',
                title: 'Success',
                content: 'Environment created',
              });

              return result;
            }}
            validationSchema={NewEnvironmentSchema}
            validateOnMount
          >
            <Form className="flex flex-col gap-3">
              <Field
                as={Input}
                id="name"
                name="name"
                label="Environment name"
              />
              {/* <KeyInput id="key" name="key" label="Key" /> */}
              <Field
                as={Input}
                id="description"
                name="description"
                label="Description"
              />
              <Field
                as={TagInput}
                id="tags"
                name="tags"
                label="Tags (separate by comma)"
              />
              <Button
                className="mt-3 justify-center py-2"
                type="submit"
                suffix={PlusCircleIcon}
              >
                Add environment
              </Button>
            </Form>
          </Formik>
        </div>
      </Modal>
      <Button
        className="py-2"
        onClick={() => setVisible(true)}
        suffix={PlusCircleIcon}
      >
        Add Environment
      </Button>
    </>
  ) : null;
};

export { CreateEnvironment };
