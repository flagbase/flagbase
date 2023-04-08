import type { Meta, StoryObj } from '@storybook/react';
import { RouterProvider } from 'react-router-dom';
import { AddNewInstanceModal } from './instances.modal';
import { newRouter } from '../../router/router';
import React from 'react';

const meta: Meta<typeof AddNewInstanceModal> = {
  title: 'Organisms/Modals/InstanceModal',
  component: AddNewInstanceModal,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  decorators: [
    (Story) => (
        <RouterProvider router={newRouter}>
            <Story />
        </RouterProvider>
};

export default meta;
type Story = StoryObj<typeof AddNewInstanceModal>;

export const Default: Story = {
  args: {
    visible: true,
  },
};
