import React from 'react';
import { Story, Meta } from '@storybook/react';

import Sidebar, { SidebarProps } from './sidebar';

export default {
  title: 'Components/Sidebar',
  component: Sidebar,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as Meta;

const Template: Story<SidebarProps> = (args) => <Sidebar {...args} />;

export const Default = Template.bind({});
Default.args = {
  level: '1'
};
