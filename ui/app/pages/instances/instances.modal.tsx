import React, { useEffect, useState } from 'react';

import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Form, Formik, FormikHelpers } from 'formik';

import { useAddInstance } from './instances';
import { InstanceSchema } from './instances.constants';
import { Instance } from './instances.functions';
import Button from '../../../components/button/button';
import Input from '../../../components/input';
import { KeyInput } from '../../../components/input/input';
import Modal from '../../../components/modal';
import Notification from '../../../components/notification';
import { ReactState } from '../workspaces/workspace.modal';

type OmittedInstance = Omit<Instance, 'expiresAt' | 'id' | 'accessToken'>;

export const AddNewInstanceModal = ({ visible, setVisible }: ReactState) => {
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mutation = useAddInstance();
  const { isSuccess, isError } = mutation;

  const onSubmit = (
    values: OmittedInstance,
    { setSubmitting }: FormikHelpers<OmittedInstance>,
  ) => {
    setIsLoading(true);
    mutation.mutate(values);
    setSubmitting(false);
    setTimeout(() => setIsLoading(false), 2000);
  };

  useEffect(
    function hideModalOnSuccess() {
      if (isSuccess) {
        setVisible(false);
      }
    },
    [isSuccess, setVisible],
  );

  useEffect(() => {
    setShowError(isError);
  }, [isError]);

  return (
    <>
      <Notification
        type="error"
        title="Could not add this instance"
        content="Did you make sure you added the correct key and secret?"
        show={showError}
        setShow={setShowError}
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
            <h1 className="text-xl font-bold">Add a new instance</h1>
            <span>
              Connect to a Flagbase instance to begin managing your flags
            </span>
          </div>
          <Formik
            initialValues={{
              name: '',
              key: '',
              connectionString: '',
              credentials: [],
            }}
            onSubmit={onSubmit}
            validationSchema={InstanceSchema}
            validateOnMount
          >
            {({ isValid }) => (
              <Form className="flex flex-col gap-3">
                <Input
                  id="name"
                  name="name"
                  label="Name"
                  placeholder="Flagbase Instance"
                  autoComplete="off"
                />
                <KeyInput
                  id="key"
                  name="key"
                  placeholder="flagbase-instance"
                  label="Key"
                  autoComplete="off"
                />
                <Input
                  id="connectionString"
                  name="connectionString"
                  label="Connection String"
                  placeholder="URL"
                  autoComplete="url"
                />
                <Input
                  id="accessKey"
                  name="accessKey"
                  label="Access Key"
                  placeholder="Key"
                  autoComplete="off"
                />
                <Input
                  id="accessSecret"
                  name="accessSecret"
                  label="Access Secret"
                  placeholder="Secret"
                  type="password"
                  autoComplete="off"
                />
                <Button
                  type="submit"
                  className="mt-3 py-2 justify-center"
                  suffix={PlusCircleIcon}
                  isLoading={isLoading}
                  disabled={!isValid}
                >
                  Add Instance
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </>
  );
};
