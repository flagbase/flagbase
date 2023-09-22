import React from 'react';

import { Form, Formik } from 'formik';

import Toggle from './toggle';

type ScenarioProps = {
  initialValue?: boolean;
  label?: string;
  disabled?: boolean;
};

export const scenarios = {
  Primary: {
    render: () => (
      <Formik initialValues={{ toggle: false }} onSubmit={() => {}}>
        <Form>
          <Toggle name="toggle" />
        </Form>
      </Formik>
    ),
  },
  WithLabel: {
    render: () => (
      <Formik initialValues={{ toggle: false }} onSubmit={() => {}}>
        <Form>
          <Toggle name="toggle" label="Toggle" />
        </Form>
      </Formik>
    ),
  },
  Checked: {
    render: () => (
      <Formik initialValues={{ toggle: true }} onSubmit={() => {}}>
        <Form>
          <Toggle name="toggle" label="Toggle" />
        </Form>
      </Formik>
    ),
  },
  Unchecked: {
    render: () => (
      <Formik initialValues={{ toggle: false }} onSubmit={() => {}}>
        <Form>
          <Toggle name="toggle" label="Toggle" />
        </Form>
      </Formik>
    ),
  },
  Disabled: {
    render: () => (
      <Formik initialValues={{ toggle: true }} onSubmit={() => {}}>
        <Form>
          <Toggle name="toggle" label="Toggle" disabled />
        </Form>
      </Formik>
    ),
  },
};
