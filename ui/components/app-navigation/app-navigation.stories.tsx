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
  title: 'Workspaces',
  buttons: [{
    title: 'Add new project',
    type: 'primary'
  }, {
    title: '...',
    type: 'secondary'
  }],
  subMenuContent: {
    Instances: {
      content: [{
        title: 'Instance 1',
        href: '#'
      },
      {
        title: 'Instance 2',
        href: '#'
      },
      {
        title: 'Instance 3',
        href: '#'
      }]
    },
    Workspaces: {
      content: [{
        title: 'Workspace 1',
        href: '#'
      },
      {
        title: 'Workspace 2',
        href: '#'
      },
      {
        title: 'Workspace 3',
        href: '#'
      }]
    },
    Projects: {
      content: [{
        title: 'Project 1',
        href: '#'
      },
      {
        title: 'Project 2',
        href: '#'
      },
      {
        title: 'Project 3',
        href: '#'
      }]
    },
    Flags: {
      content: [{
        title: 'Flag 1',
        href: '#'
      },
      {
        title: 'Flag 2',
        href: '#'
      },
      {
        title: 'Flag 3',
        href: '#'
      }]
    }
  }
};
