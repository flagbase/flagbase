import React from 'react';
import { Story, Meta } from '@storybook/react';

import Input, { InputProps } from './input';

export default {
  title: 'Components/Input',
  component: Input,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as Meta;

const Template: Story<InputProps> = (args) => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {
  placeholder: 'Enter a flag name'
};

