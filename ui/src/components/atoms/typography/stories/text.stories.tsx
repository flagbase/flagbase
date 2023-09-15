import type { Meta, StoryObj } from '@storybook/react';

import { Text } from '../';

const meta: Meta<typeof Text> = {
  title: 'Atoms/Typography/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
    },
  },
  args: {
    children: 'Text',
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

export const Default: Story = {
  args: {
    children: 'Text 1',
  },
};
