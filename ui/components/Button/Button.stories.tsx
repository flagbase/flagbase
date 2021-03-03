import React from 'react';
import { Story, Meta } from '@storybook/react';

import Button, { ButtonProps } from './button';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  type: 'primary',
  title: 'Button',
  children: 'Primary Button'
};

export const Secondary = Template.bind({});
Secondary.args = {
  title: 'Button',
  children: 'Secondary Button'
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  title: 'Button',
  children: 'Large Button'
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  title: 'Button',
  children: 'Small Button'
};
