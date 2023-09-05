import * as React from 'react';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

type Workspace = {
  id: number;
  title: JSX.Element;
  href: string;
  name: JSX.Element;
  action: JSX.Element;
  description: JSX.Element;
  tags: JSX.Element[];
  key: string;
};

const columnHelper = createColumnHelper<Workspace>();

const columns = [
  columnHelper.accessor('name', {
    header: () => 'Name',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('description', {
    header: () => 'Description',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('tags', {
    header: () => 'Tags',
    footer: (info) => info.column.id,
  }),
];

export function Table({ dataSource }) {
  const [data, setData] = React.useState(() => [...dataSource]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="h-4" />
    </div>
  );
}
