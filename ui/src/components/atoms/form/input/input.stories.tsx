import React from 'react';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import * as Icons from '@heroicons/react/24/solid';
import type { Meta, StoryObj } from '@storybook/react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { Input } from '.';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Form/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      options: Object.keys(Icons),
      mapping: Icons,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const WithPlaceholder: Story = {
  args: {
    name: 'name',
    label: 'Name',
    type: 'text',
  },
  decorators: [
    (Story) => (
      <div className="w-1/3">
        <Formik
          initialValues={{ name: 'John Wick' }}
          onSubmit={() => {}}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .min(2, 'Too Short!')
              .max(50, 'Too Long!')
              .required('This field is required'),
          })}
        >
          <Form>
            <Story />
          </Form>
        </Formik>
      </div>
    ),
  ],
};

export const WithIcon: Story = {
  args: {
    label: 'Name',
    name: 'name',
    icon: MagnifyingGlassIcon,
  },
  decorators: [
    (Story) => (
      <div className=" w-1/3">
        <Formik
          initialValues={{ name: '' }}
          onSubmit={() => {}}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .min(2, 'Too Short!')
              .max(50, 'Too Long!')
              .required('This field is required'),
          })}
        >
          <Form>
            <Story />
          </Form>
        </Formik>
      </div>
    ),
  ],
};

export const Disabled: Story = {
  args: {
    name: 'name',
    label: 'Name',
    disabled: true,
  },
  decorators: [
    (Story) => (
      <div className=" w-1/3">
        <Formik
          initialValues={{ name: 'John Wick' }}
          onSubmit={() => {}}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .min(2, 'Too Short!')
              .max(50, 'Too Long!')
              .required('This field is required'),
          })}
        >
          <Form>
            <Story />
          </Form>
        </Formik>
      </div>
    ),
  ],
};

export const WithError: Story = {
  args: {
    name: 'name',
  },
  decorators: [
    (Story) => (
      <div className=" w-1/3">
        <Formik
          initialValues={{ name: 'John Wick' }}
          onSubmit={() => {}}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .min(2, 'Too Short!')
              .max(50, 'Too Long!')
              .required('This field is required'),
          })}
          initialErrors={{ name: 'This field is required' }}
          initialTouched={{ name: true }}
        >
          <Form>
            <Story />
          </Form>
        </Formik>
      </div>
    ),
  ],
};
