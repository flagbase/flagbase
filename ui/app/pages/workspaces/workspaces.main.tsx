import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PlusCircleOutlined } from '@ant-design/icons'
import { Alert, Col, notification, Row, Typography } from 'antd'
import Table from '../../../components/table/table'
import { InstanceContext } from '../../context/instance'
import { WorkspaceContext } from '../../context/workspace'
import { fetchWorkspaces } from './api'
import Button from '../../../components/button'
import { Workspace as APIWorkspace } from './api'
import { constants, workspaceColumns } from './workspace.constants'
import { constants as instanceConstants } from '../instances/instances.constants'
import Input from '../../../components/input'
import { SearchOutlined } from '@ant-design/icons'
import { convertWorkspaces } from './workspaces.helpers'
import { CreateWorkspace } from './modal'
import Instances, { getInstances } from '../instances/instances'
import { useQuery } from 'react-query'

const MainWorkspaces: React.FC = () => {
    const { instanceKey } = useParams<{ instanceKey: string }>()
    if (!instanceKey) {
        return <Alert message={instanceConstants.error} type="error" />
    }

    const [visible, setVisible] = useState(false)
    const [filter, setFilter] = useState('')
    const navigate = useNavigate()
    const { setSelectedEntityId } = useContext(InstanceContext)
    const { entities: workspaces, addEntity, addEntities, setStatus, status } = useContext(WorkspaceContext)

    const { data: instanceList } = useQuery<Instances>('instances', getInstances, {
        select: (instances) => {
            return instances.filter((instance) => instance.key === instanceKey)
        },
    })

    const instance = instanceList && instanceList.length > 0 ? instanceList[0] : null

    if (!instance) {
        return <Alert message={instanceConstants.error} type="error" />
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
                navigate('/')
                notification.error({
                    message: constants.error,
                })
            })
            .finally(() => {
                setStatus('loaded')
            })

        return () => {
            setStatus('idle')
        }
    }, [])

    return (
        <React.Fragment>
            <CreateWorkspace visible={visible} setVisible={setVisible} />

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
        </React.Fragment>
    )
}

export default MainWorkspaces
