import React from 'react';

import { Tag } from '@flagbase/ui';
import { Meta } from '@storybook/react';
import { createColumnHelper } from '@tanstack/react-table';

import Table, { TableProps } from './table';

type Entity = {
  name: string;
  description: string;
  tags: string[];
  onClick?: () => void;
};

const columnHelper = createColumnHelper<Entity>();

const Tags = ({ tags }: { tags: string[] }) => {
  console.log('tags', tags);
  if (!tags) {
    return null;
  }

  return tags.map((tag) => (
    <Tag className="mx-2 h-fit py-2" key={tag}>
      {tag}
    </Tag>
  ));
};

const data: Entity[] = [
  {
    name: 'hello',
    description: 'world',
    tags: ['Sydney', 'Melbourne', 'Townsville'],
    onClick: () => console.log('hello world'),
  },
  {
    name: 'foo',
    description: 'bar',
    tags: ['Sydney', 'Melbourne', 'Townsville'],
    onClick: () => console.log('foo bar'),
  },
];

const meta: Meta<TableProps<Entity, any>> = {
  component: Table,
  args: {
    data,
    columns: [
      columnHelper.accessor('name', {
        header: () => 'Name',
      }),
      columnHelper.accessor('description', {
        header: () => 'Description',
      }),
      columnHelper.accessor('tags', {
        header: () => 'Tags',
        cell: (props) => <Tags tags={props.getValue()} />,
      }),
    ],
  },
};

export default meta;

export const Default = {};
