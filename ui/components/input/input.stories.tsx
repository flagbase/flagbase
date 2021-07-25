import React from 'react';
import { Story, Meta } from '@storybook/react';

import Input, { InputProps } from './input';

export default {
  title: 'Forms/Input',
  component: Input
} as Meta;

const Template: Story<InputProps> = (args) => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {
  placeholder: 'Enter a flag name'
};
