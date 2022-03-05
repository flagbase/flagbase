import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PlusCircleOutlined } from '@ant-design/icons'
import { Alert, Col, notification, Row, Typography } from 'antd'
import { Layout, Content } from '../../../components/layout'
import Table from '../../../components/table/table'
import { InstanceContext } from '../../context/instance'
import { WorkspaceContext } from '../../context/workspace'
import { fetchWorkspaces } from './api'
import { CreateWorkspace } from './modal'
import Button from '../../../components/button'
import { Workspace as APIWorkspace } from './api'
import { constants, workspaceColumns } from './workspace.constants'
import Input from '../../../components/input'
import { SearchOutlined } from '@ant-design/icons'
import { convertWorkspaces } from './workspaces.helpers'

const { Title } = Typography

const Workspaces: React.FC = () => {
    const { instanceKey } = useParams<{ instanceKey: string }>()
    if (!instanceKey) {
        return <Alert message="Could not load this instance" type="error" />
    }

    const [visible, setVisible] = useState(false)
    const [filter, setFilter] = useState('')
    const { getEntity, setSelectedEntityId } = useContext(InstanceContext)
    const { entities: workspaces, addEntity, addEntities, setStatus, status } = useContext(WorkspaceContext)

    const instance = getEntity(instanceKey)
    if (!instance) {
        return <Alert message="Could not load this instance" type="error" />
    }

    useEffect(() => {
        setStatus('loading')
        setSelectedEntityId(instanceKey)
        fetchWorkspaces(instance.connectionString, instance.accessToken)
            .then((result: APIWorkspace[]) => {
                const workspaceList = result.reduce((previous, workspace) => {
                    return {
                        ...previous,
                        [workspace.id]: workspace,
                    }
                }, {})
                addEntities(workspaceList)
            })
            .catch(() => {
                notification.error({
                    message: constants.error,
                })
            })
            .finally(() => {
                setStatus('loaded')
            })
    }, [visible])

    return (
        <React.Fragment>
            <CreateWorkspace visible={visible} setVisible={setVisible} />
            <Title level={3}>{constants.join}</Title>
            <Layout>
                <Content>
                    <Row wrap={false} gutter={12}>
                        <Col flex="none">
                            <Button onClick={() => setVisible(true)} type="primary" icon={<PlusCircleOutlined />}>
                                {constants.create}
                            </Button>
                        </Col>
                        <Col flex="auto">
                            <Input
                                onChange={(event) => setFilter(event.target.value)}
                                placeholder="Search"
                                prefix={<SearchOutlined />}
                            />
                        </Col>
                    </Row>
                    <Table
                        loading={status !== 'loaded'}
                        dataSource={convertWorkspaces(workspaces, instance, filter, addEntity)}
                        columns={workspaceColumns}
                    />
                </Content>
            </Layout>
        </React.Fragment>
    )
}

export default Workspaces
