import React from 'react';

import { Tag } from '@flagbase/ui';
import { createColumnHelper } from '@tanstack/react-table';

export type Entity = {
  name: string;
  description: string;
  tags: string[];
  onClick?: () => void;
};

export const tableSampleData: Entity[] = [
  {
    name: 'hello',
    description: 'world',
    tags: ['Sydney', 'Chicago', 'Townsville'],
    onClick: () => console.log('hello world'),
  },
  {
    name: 'foo',
    description: 'bar',
    tags: ['Sydney', 'Chicago', 'Townsville'],
    onClick: () => console.log('foo bar'),
  },
];

const Tags = ({ tags }: { tags: string[] }) => {
  if (!tags) {
    return null;
  }

  return tags.map((tag) => (
    <Tag className="mx-2 h-fit py-2" key={tag}>
      {tag}
    </Tag>
  ));
};

const tableColumnHelper = createColumnHelper<Entity>();

export const tableSampleColumns = [
  tableColumnHelper.accessor('name', {
    header: 'Name',
  }),
  tableColumnHelper.accessor('description', {
    header: 'Description',
  }),
  tableColumnHelper.accessor('tags', {
    header: 'Tags',
    cell: (props) => <Tags tags={props.getValue()} />,
  }),
];
