import React from 'react';
import { Story, Meta } from '@storybook/react';

export default {
  title: 'Components/Sidebar',
  component: Sidebar,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as Meta;

const Template: Story<SidebarProps> = (args) => <Sidebar {...args}>
  <SidebarElement image={home} />
  <SidebarElement image={settings} />
  <SidebarElement image={flag} />
  <SidebarElement image={profile} />

</Sidebar>;

export const Default = Template.bind({});
Default.args = {
  backgroundColor: '#24292E'
};
