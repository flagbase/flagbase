import React from 'react'
import { Table as AntdTable, TableColumnProps, TableProps as AntdTableProps, TableColumnType } from 'antd'
import styled from '@emotion/styled'

export type TableProps = {
    loading: boolean
    columns: TableColumnProps<TableColumnType<string>>[]
} & AntdTableProps<Object>

const StyledTable = styled(AntdTable)`
    .ant-table-thead > tr > th {
        background: repeat;
    }
`

const Table: React.FC<TableProps> = ({ loading, columns, dataSource }) => {
    return <StyledTable loading={loading} dataSource={dataSource} columns={columns}></StyledTable>
}

export default Table
