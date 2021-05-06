import React from 'react';
import { Story, Meta } from '@storybook/react';

import PollingApp from './polling-app';

export default {
  title: 'Example/PollingApp',
  component: PollingApp,
} as Meta;

const Template: Story = (args) => <PollingApp {...args} />;

export const DefaultPollingApp = Template.bind({});
DefaultPollingApp.args = {
};
