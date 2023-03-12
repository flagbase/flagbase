import React from 'react'
import { Table as AntdTable, TableColumnProps, TableProps as AntdTableProps, TableColumnType } from 'antd'
import styled from '@emotion/styled'
import { PlusIcon } from '@heroicons/react/24/outline'
import EmptyState from '../empty-state'
import Button from '../button/button'

export type TableProps = {
    loading: boolean
    columns: TableColumnProps<TableColumnType<string>>[]
    emptyState: React.ReactElement
} & AntdTableProps<Object>

const StyledTable = styled(AntdTable)`
    .ant-table-thead > tr > th {
        background: repeat;
    }
`

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
    return (loading || dataSource?.length || 0) > 0 ? (
        <StyledTable loading={loading} dataSource={dataSource} columns={columns}></StyledTable>
    ) : (
        emptyState
    )
}

export default Table
