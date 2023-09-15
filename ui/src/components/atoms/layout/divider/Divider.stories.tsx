import * as Icons from '@heroicons/react/24/solid';
import type { Meta, StoryObj } from '@storybook/react';

import { Divider } from '.';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Divider> = {
  title: 'Atoms/Form/Divider',
  component: Divider,
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
    type: 'Divider',
    prefix: null,
    suffix: null,
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

export const Primary: Story = {
  args: {
    children: 'Primary Divider',
  },
};
