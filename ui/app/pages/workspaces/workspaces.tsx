import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PlusCircleOutlined } from '@ant-design/icons'
import { Alert, notification, Typography } from 'antd'
import { Layout, Content } from '../../../components/layout'
import Table from '../../../components/table/table'
import { Instance, InstanceContext } from '../../context/instance'
import { Workspace, WorkspaceContext } from '../../context/workspace'
import { fetchWorkspaces } from './api'
import { CreateWorkspace } from './modal'
import Button from '../../../components/button'
import { Entities, Entity } from '../../lib/entity-store/entity-store'
import { Workspace as APIWorkspace } from './api'
import { mergeExisting } from '../../helpers/mergeObject'
import { jsx } from '@emotion/react'
import { constants } from './workspace.constants'

const { Title, Text } = Typography

interface ConvertedWorkspace {
    id: number
    title: JSX.Element
    href: string
    name: JSX.Element
    description: JSX.Element
    tags: string
    action: JSX.Element
}

export const convertWorkspaces = (
    workspaceList: Entities<Workspace>,
    instance: Instance,
    addEntity?: (entity: Entity<Workspace>) => void
): ConvertedWorkspace[] => {
    console.log('test', workspaceList, instance)
    if (!workspaceList) {
        return []
    }

    return Object.values(workspaceList)
        .filter((workspace): workspace is Entity<Workspace> => workspace !== undefined)
        .map((currentWorkspace, index) => {
            const updateWorkspace = (updatedWorkspace: Partial<Entity<Workspace>>) => {
                if (addEntity) {
                    const mergedEntity = { ...updatedWorkspace, ...currentWorkspace }
                    addEntity(mergedEntity)
                }
            }
            return {
                id: index,
                title: <Text>{currentWorkspace.attributes.name}</Text>,
                href: `/projects/${instance?.id}/${currentWorkspace?.attributes.key}`,
                name: (
                    <Text
                        editable={{
                            onChange: (value) =>
                                updateWorkspace({ attributes: { ...currentWorkspace.attributes, name: value } }),
                        }}
                    >
                        {currentWorkspace.attributes.name}
                    </Text>
                ),
                description: (
                    <Text
                        editable={{
                            onChange: (value) =>
                                updateWorkspace({ attributes: { ...currentWorkspace.attributes, description: value } }),
                        }}
                    >
                        {currentWorkspace.attributes.description}
                    </Text>
                ),
                tags: currentWorkspace.attributes.tags.join(', '),
                action: (
                    <>
                        <Link to={`/projects/${instance?.id}/${currentWorkspace?.attributes.key}`}>Connect</Link>
                    </>
                ),
            }
        })
}

const Workspaces: React.FC = () => {
    const { instanceKey } = useParams<{ instanceKey: string }>()
    if (!instanceKey) {
        return <Alert message="Could not load this instance" type="error" />
    }

    const [visible, setVisible] = useState(false)
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
    console.log('STATUS', status)
    return (
        <React.Fragment>
            <CreateWorkspace visible={visible} setVisible={setVisible} />
            <Button onClick={() => setVisible(true)} type="primary" icon={<PlusCircleOutlined />}>
                {constants.create}
            </Button>
            <Layout>
                <Content>
                    <Title level={3}>Join a workspace</Title>
                    <Table
                        loading={status !== 'loaded'}
                        dataSource={convertWorkspaces(workspaces, instance, addEntity)}
                        columns={[
                            {
                                title: 'Name',
                                dataIndex: 'name',
                                key: 'name',
                            },
                            {
                                title: 'Description',
                                dataIndex: 'description',
                                key: 'description',
                            },
                            {
                                title: 'Tags',
                                dataIndex: 'tags',
                                key: 'tags',
                            },
                            {
                                title: 'Action',
                                dataIndex: 'action',
                                key: 'action',
                            },
                        ]}
                    />
                </Content>
            </Layout>
        </React.Fragment>
    )
}

export default Workspaces
