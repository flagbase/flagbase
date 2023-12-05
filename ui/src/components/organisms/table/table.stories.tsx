import { Meta } from '@storybook/react';

import Table, { TableProps } from '.';
import { Entity, tableSampleColumns, tableSampleData } from './table.scenarios';

const meta: Meta<TableProps<Entity, any>> = {
  component: Table,
  args: {
    data: tableSampleData,
    columns: tableSampleColumns,
  },
  argTypes: {
    trOnClick: {
      action: 'trOnClick',
    },
  },
};

export default meta;

export const Default = {};
