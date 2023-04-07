import React, { useState } from 'react';
import {
  Table as AntdTable,
  TableColumnProps,
  TableProps as AntdTableProps,
  TableColumnType,
} from 'antd';
import styled from '@emotion/styled';
import EmptyState from '../empty-state';
import Button from '../button/button';
import { useNavigate } from 'react-router-dom';
import { DocumentDuplicateIcon } from '@heroicons/react/20/solid';

export type TableProps = {
  loading: boolean;
  columns: TableColumnProps<TableColumnType<string>>[];
  emptyState: React.ReactElement;
} & AntdTableProps<Object>;

const StyledTable = styled(AntdTable)`
  cursor: pointer;
  && tbody > tr:hover > td {
    background: #f1f5f9;
  }
`;

export const CopyRow = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex gap-1 items-center">
      <div>{text}</div>
      <button
        type="button"
        className="p-1 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        onClick={(event) => {
          event.preventDefault();
          navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 3000);
          });
        }}
      >
        <DocumentDuplicateIcon className="w-5 h-5 cursor-pointer" />
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
      onRow={(record, rowIndex) => {
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
