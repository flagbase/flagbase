import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import Toggle from './toggle';
import { scenarios } from './toggle.scenarios';

const meta: Meta<typeof Toggle> = {
  component: Toggle,
};

export default meta;

export const Primary = scenarios.Primary;
export const WithLabel = scenarios.WithLabel;
export const Checked = scenarios.Checked;
export const Unchecked = scenarios.Unchecked;
export const Disabled = scenarios.Disabled;
