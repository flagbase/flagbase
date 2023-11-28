import * as React from 'react';

import { classNames } from '@flagbase/ui';
import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  noop,
  useReactTable,
} from '@tanstack/react-table';

export type TableProps<TData, TValue> = {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  trOnClick: (href: Row<TData>) => void;
};

export default function Table<TData, TValue>({
  data,
  columns,
  trOnClick = noop,
}: TableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel<TData>(),
  });

  return (
    <div className="-mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  key={header.id}
                >
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
            <tr
              className="cursor-pointer hover:bg-slate-50"
              onClick={() => {
                trOnClick(row);
              }}
              key={row.id}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  className={classNames(
                    'relative py-4 pl-4 pr-3 text-sm sm:pl-6',
                  )}
                  key={cell.id}
                >
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
