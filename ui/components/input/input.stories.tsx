import React from 'react';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import * as Icons from '@heroicons/react/24/solid';
import type { Meta, StoryObj } from '@storybook/react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import Input from '.';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Input> = {
  title: 'Form/Input',
  component: Input,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    icon: {
      options: Object.keys(Icons),
      mapping: Icons,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Enter your name',
    name: 'name',
    label: 'Name',
    type: 'text',
  },
  decorators: [
    (Story) => (
      <div className="w-1/3 mx-auto">
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

export const WithIcon: Story = {
  args: {
    label: 'Name',
    name: 'name',
    icon: MagnifyingGlassIcon,
  },
  decorators: [
    (Story) => (
      <div className="w-1/3 mx-auto">
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
    placeholder: 'Enter your name',
    disabled: true,
  },
  decorators: [
    (Story) => (
      <div className="w-1/3 mx-auto">
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
    placeholder: 'Enter your name',
  },
  decorators: [
    (Story) => (
      <div className="w-1/3 mx-auto">
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
