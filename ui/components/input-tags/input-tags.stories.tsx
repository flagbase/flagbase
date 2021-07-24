import React from 'react';
import { Story, Meta } from '@storybook/react';

import InputTags, { InputTagProps } from './input-tags';

export default {
  title: 'Components/InputTags',
  component: InputTags
} as Meta;

const Template: Story<InputTagProps> = (args) => <InputTags {...args} />;

export const Default = Template.bind({});
Default.args = {
  placeholder: 'Add some tags for your flags'
};
