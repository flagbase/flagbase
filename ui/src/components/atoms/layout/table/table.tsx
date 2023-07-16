import React from 'react';

import styled from '@emotion/styled';
import { DocumentDuplicateIcon } from '@heroicons/react/20/solid';
import {
  Table as AntdTable,
  TableColumnProps,
  TableProps as AntdTableProps,
  TableColumnType,
} from 'antd';
import { useNavigate } from 'react-router-dom';

import { useNotification } from '../../../../hooks/use-notification';
import { EmptyState } from '../../../molecules/empty-state';
import { Button } from '../../form/button';

export type TableProps = {
  loading: boolean;
  columns: TableColumnProps<TableColumnType<string>>[];
  emptyState: React.ReactElement;
} & AntdTableProps<TableColumnType<string>>;

const StyledTable = styled(AntdTable)`
  cursor: pointer;
  && tbody > tr:hover > td {
    background: #f1f5f9;
  }
`;

export const CopyRow = ({ text }: { text: string }) => {
  const { addNotification } = useNotification();

  return (
    <div className="flex items-center gap-1">
      <div>{text}</div>
      <button
        type="button"
        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
        onClick={(event) => {
          event.preventDefault();
          void navigator.clipboard.writeText(text).then(() => {
            addNotification({
              type: 'success',
              title: 'Copied',
              content: 'Copied to clipboard',
            });
          });
        }}
      >
        <DocumentDuplicateIcon className="h-5 w-5 cursor-pointer" />
      </button>
    </div>
  );
};

const Table: React.FC<TableProps> = ({
  loading,
  columns,
  dataSource,
  emptyState = (
    <EmptyState
      title="Nada"
      description="Nothing"
      button={<Button className="py-2"> Go back</Button>}
      callback={null}
    />
  ),
}) => {
  const navigate = useNavigate();

  return (loading || dataSource?.length || 0) > 0 ? (
    <StyledTable
      loading={loading}
      dataSource={dataSource}
      columns={columns}
      onRow={(record) => {
        return {
          onClick: (event) => {
            event.preventDefault();
            const { href } = record;
            if (href) {
              navigate(href);
            }
          },
        };
      }}
    />
  ) : (
    emptyState
  );
};

export default Table;
