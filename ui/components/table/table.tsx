import React from 'react';
import { Table as AntdTable, TableColumnProps, TableProps as AntdTableProps, TableColumnType } from 'antd';
import Column from 'antd/lib/table/Column';

export type TableProps = {
  loading: boolean;
  dataSource: AntdTableProps<string>[];
  columns: TableColumnProps<TableColumnType<string>>[];
};

const Table: React.FC<TableProps> = ({ loading, columns, dataSource }) => {
  return <AntdTable loading={loading} dataSource={dataSource} columns={columns}>
  </AntdTable>;
};

export default Table;
