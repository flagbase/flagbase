import * as Icons from '@heroicons/react/24/solid';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '.';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Button> = {
  title: 'Atoms/Form/Button',
  component: Button,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    prefix: {
      options: Object.keys(Icons),
      mapping: Icons,
    },
    suffix: {
      options: Object.keys(Icons),
      mapping: Icons,
    },
    isLoading: {
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    isLoading: false,
    type: 'button',
    prefix: null,
    suffix: null,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

export const Primary: Story = {
  args: {
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

export const WithPrefix: Story = {
  args: {
    children: 'With Prefix',
    prefix: Icons.MagnifyingGlassIcon,
  },
};

export const WithSuffix: Story = {
  args: {
    children: 'With Suffix',
    suffix: Icons.MagnifyingGlassIcon,
  },
};

export const IsLoading: Story = {
  args: {
    children: 'Button',
    isLoading: true,
    className: 'w-64',
  },
};

export const LongText: Story = {
  args: {
    children: 'This is a very long text that will be truncated',
  },
};
