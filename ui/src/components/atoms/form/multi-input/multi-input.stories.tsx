import React from 'react';

import * as Icons from '@heroicons/react/24/solid';
import type { Meta, StoryObj } from '@storybook/react';
import { Form, Formik } from 'formik';

import MultiInput from '.';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof MultiInput> = {
  title: 'Form/MultiInput',
  component: MultiInput,
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
type Story = StoryObj<typeof MultiInput>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

export const Default: Story = {
  args: {
    label: 'Credentials',
    name: 'credentials',
    addText: 'Add another credential',
    multiInputLabels: {
      accessKey: 'Access Key',
      accessSecret: 'Access Secret',
    },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto">
        <Formik
          initialValues={{
            credentials: [
              {
                accessKey: '',
                accessSecret: '',
              },
            ],
          }}
          onSubmit={() => {}}
        >
          <Form>
            <Story />
          </Form>
        </Formik>
      </div>
    ),
  ],
};

export const MobileViewPort: Story = {
  args: {
    label: 'Credentials',
    name: 'credentials',
    addText: 'Add another credential',
    multiInputLabels: {
      accessKey: 'Access Key',
      accessSecret: 'Access Secret',
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto">
        <Formik
          initialValues={{
            credentials: [
              {
                accessKey: '',
                accessSecret: '',
              },
            ],
          }}
          onSubmit={() => {}}
        >
          <Form>
            <Story />
          </Form>
        </Formik>
      </div>
    ),
  ],
};
