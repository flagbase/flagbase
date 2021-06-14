import React from 'react';
import { Story, Meta } from '@storybook/react';

import { Layout, Content, LayoutProps } from './layout';

export default {
  title: 'Components/Layout',
  component: Layout,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as Meta;

const Template: Story<LayoutProps> = (args) => <Layout {...args} />;

export const Default = Template.bind({});
Default.args = {
  placeholder: 'Enter a flag name'
};


const ContainerTemplate: Story<LayoutProps> = (args) => {
  return (<Layout style={{ height: '100vh', padding: '50px' }} {...args}>
    <Content style={{
      padding: '0px 50px',
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)'
    }}>
      test
    </Content>
  </Layout>)
};

export const Container = ContainerTemplate.bind({});


