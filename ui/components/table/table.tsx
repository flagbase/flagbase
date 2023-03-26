import React from 'react'
import { Table as AntdTable, TableColumnProps, TableProps as AntdTableProps, TableColumnType } from 'antd'
import styled from '@emotion/styled'
import EmptyState from '../empty-state'
import Button from '../button/button'
import { useNavigate } from 'react-router-dom'

export type TableProps = {
    loading: boolean
    columns: TableColumnProps<TableColumnType<string>>[]
    emptyState: React.ReactElement
} & AntdTableProps<Object>

const StyledTable = styled(AntdTable)`
    cursor: pointer;
    && tbody > tr:hover > td {
        background: #f1f5f9;
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
    const navigate = useNavigate()
    return (loading || dataSource?.length || 0) > 0 ? (
        <StyledTable
            loading={loading}
            dataSource={dataSource}
            columns={columns}
            onRow={(record, rowIndex) => {
                return {
                    onClick: (event) => {
                        const { href } = record
                        if (href) {
                            navigate(href)
                        }
                    },
                }
            }}
        />
    ) : (
        emptyState
    )
}

export default Table
