import React from 'react';
import { Story, Meta } from '@storybook/react';

import AppNavigation, { AppNavigationProps } from './app-navigation';

export default {
  title: 'Components/AppNavigation',
  component: AppNavigation,
  argTypes: {
    hasBackIcon: { control: 'boolean' }
  }
} as Meta;

const Template: Story<AppNavigationProps> = (args) => <AppNavigation {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'Workspaces'
};
