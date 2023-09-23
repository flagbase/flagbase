import React from 'react';

import { Tag } from '@flagbase/ui';
import { Meta } from '@storybook/react';
import { createColumnHelper } from '@tanstack/react-table';

import Table from './table';

type Entity = {
  key: string;
  name: string;
  description: string;
  tags: React.JSX.Element;
  toggle: string;
  onClick?: () => void;
};
const columnHelper = createColumnHelper<Entity>();

const Tags = (tags: string[]) =>
  tags.map((tag) => (
    <Tag className="h-fit py-2" key={tag}>
      {tag}
    </Tag>
  ));
const meta: Meta<typeof Table> = {
  component: Table,
  args: {
    data: [
      {
        key: 'hello',
        name: 'hello',
        description: 'world',
        tags: () => <Tags tags={['foo', 'bar']} />,
        onClick: () => console.log('hello world'),
      },
      {
        name: 'foo',
        description: 'bar',
        onClick: () => console.log('foo bar'),
      },
    ],
    columns: [
      columnHelper.accessor('name', {
        header: () => 'Name',
      }),
      columnHelper.accessor('description', {
        header: () => 'Description',
      }),
      columnHelper.accessor('tags', {
        header: () => 'Tags',
      }),
    ],
  },
};

export default meta;

export const Default = {};
