import React from 'react';
import { Story, Meta } from '@storybook/react';

import Text, { TextProps } from './text';

export default {
  title: 'Components/Text',
  component: Text,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as Meta;

const Template: Story<TextProps> = (args) => <Text {...args} />;

export const Default = Template.bind({});
Default.args = {
  level: '1',
};

