import React from 'react';
import { Story, Meta } from '@storybook/react';

import Text, { TextProps } from './text';

export default {
  title: 'Components/Text',
  component: Text
} as Meta;

const Template: Story<TextProps> = (args) => <Text {...args}> {args.text} </Text>;

export const Default = Template.bind({});
Default.args = {
  text: 'Hello there. General kenobi!!'
};
