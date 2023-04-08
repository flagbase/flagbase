import React from 'react';

import { Story, Meta } from '@storybook/react';

import Table, { TableProps } from './table';

export default {
  title: 'Components/Table',
  component: Table,
} as Meta;

const Template: Story<TableProps> = (args) => <Table {...args}></Table>;

export const Default = Template.bind({});

Default.args = {
  dataSource: [
    {
      key: '1',
      name: 'Pakistan',
      url: 'https://flagbase.infinibit.com.au',
      connect: <a>Connect</a>,
    },
    {
      key: '2',
      name: 'India',
      url: 'https://flagbase.chronal.space',
      connect: <a>Connect</a>,
    },
  ],
  columns: [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: 'Action',
      dataIndex: 'connect',
      key: 'connect',
    },
  ],
};
