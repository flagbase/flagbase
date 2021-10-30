import React from 'react';
import { Table as AntdTable, TableColumnProps, TableProps as AntdTableProps, TableColumnType } from 'antd';
import Column from 'antd/lib/table/Column';

export type TableProps = {
  dataSource: AntdTableProps<string>[];
  columns: TableColumnProps<TableColumnType<string>>[];
};

const Table: React.FC<TableProps> = ({ columns, dataSource }) => {
  return <AntdTable dataSource={dataSource}>

    {columns.map((column) => (
      <Column title={column.title} dataIndex={column.dataIndex} key={column.key} />))}

    <Column
      title="Action"
      key="action"
      render={() => (
        <a>Connect</a>
      )}
    />
  </AntdTable>;
};

export default Table;
