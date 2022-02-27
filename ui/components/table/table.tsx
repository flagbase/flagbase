import React from 'react';
import { Table as AntdTable, TableColumnProps, TableProps as AntdTableProps, TableColumnType } from 'antd';

export type TableProps = {
  loading: boolean;
  columns: TableColumnProps<TableColumnType<string>>[]; 
} & AntdTableProps<Object>

const Table: React.FC<TableProps> = ({ loading, columns, dataSource }) => {
  return <AntdTable loading={loading} dataSource={dataSource} columns={columns}>
  </AntdTable>;
};

export default Table;
