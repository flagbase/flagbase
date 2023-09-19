// Toggle.stories.ts|tsx

import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { Form, Formik } from 'formik';

import Toggle from './toggle';

const meta: Meta<typeof Toggle> = {
  component: Toggle,
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Primary: Story = {
  render: () => (
    <Formik
      initialValues={{
        toggle: false,
      }}
      onSubmit={() => {}}
    >
      <Form>
        <Toggle name="toggle" />
      </Form>
    </Formik>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <Formik
      initialValues={{
        toggle: false,
      }}
      onSubmit={() => {}}
    >
      <Form>
        <Toggle name="toggle" label="Toggle" />
      </Form>
    </Formik>
  ),
};

export const Checked: Story = {
  render: () => (
    <Formik
      initialValues={{
        toggle: true,
      }}
      onSubmit={() => {}}
    >
      <Form>
        <Toggle name="toggle" label="Toggle" />
      </Form>
    </Formik>
  ),
};

export const Unchecked: Story = {
  render: () => (
    <Formik
      initialValues={{
        toggle: false,
      }}
      onSubmit={() => {}}
    >
      <Form>
        <Toggle name="toggle" label="Toggle" />
      </Form>
    </Formik>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Formik
      initialValues={{
        toggle: true,
      }}
      onSubmit={() => {}}
    >
      <Form>
        <Toggle name="toggle" label="Toggle" disabled />
      </Form>
    </Formik>
  ),
};
