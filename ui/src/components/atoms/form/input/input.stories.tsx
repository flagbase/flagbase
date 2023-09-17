import React, { useState } from 'react';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import * as Icons from '@heroicons/react/24/solid';
import type { Meta, StoryObj } from '@storybook/react';

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
    value: 'Hello',
  },
  render: (args) => {
    console.log('args', args);
    const [value, setValue] = useState(args.value);

    return (
      <Input
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Name',
    name: 'name',
    icon: MagnifyingGlassIcon,
  },
  render: (args) => {
    console.log('args', args);
    const [value, setValue] = useState('');

    return (
      <Input
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    name: 'name',
    label: 'Name',
    disabled: true,
  },
  render: (args) => {
    console.log('args', args);
    const [value, setValue] = useState('');

    return (
      <Input
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};

export const WithError: Story = {
  args: {
    name: 'name',
  },
  render: (args) => {
    console.log('args', args);
    const [value, setValue] = useState('');

    return (
      <Input
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};
