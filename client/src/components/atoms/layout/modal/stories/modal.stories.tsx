import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Modal } from '../';

const meta: Meta<typeof Modal> = {
  title: 'Molecules/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    open: false,
    onClose: () => {},

    children: (
      <>
        <h2 className="text-lg font-medium">Sample Modal Content</h2>
        <p className="mt-4 text-gray-600">
          This is an example of the modal component with sample content.
        </p>
      </>
    ),
  },
};

export const WithLotsOfText: Story = {
  args: {
    open: false,
    children: (
      <>
        <h2 className="text-lg font-medium">Sample Modal Content</h2>
        <p className="mt-4 text-gray-600">
          This is an example of the modal component with sample content.
        </p>
        <p className="mt-4 text-gray-600">
          This is an example of the modal component with sample content.
        </p>
        <p className="mt-4 text-gray-600">
          This is an example of the modal component with sample content.
        </p>
      </>
    ),
  },
};
