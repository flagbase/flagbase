import type { Meta, StoryObj } from '@storybook/react';

import { Heading } from './heading';

const meta: Meta<typeof Heading> = {
  title: 'Atoms/Typography/Heading',
  component: Heading,
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: {
        type: 'select',
        options: [1, 2, 3, 4, 5, 6],
      },
    },
    children: {
      control: 'text',
    },
  },
  args: {
    level: 1,
    children: 'Heading',
  },
};

export default meta;
type Story = StoryObj<typeof Heading>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

export const H1: Story = {
  args: {
    children: 'Heading 1',
    level: 1,
  },
};

export const H2: Story = {
  args: {
    children: 'Heading 2',
    level: 2,
  },
};

export const H3: Story = {
  args: {
    children: 'Heading 3',
    level: 3,
  },
};

export const H4: Story = {
  args: {
    children: 'Heading 4',
    level: 4,
  },
};

export const H5: Story = {
  args: {
    children: 'Heading 5',
    level: 5,
  },
};

export const H6: Story = {
  args: {
    children: 'Heading 6',
    level: 6,
  },
};
