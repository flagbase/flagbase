import React, { useContext, useState } from 'react'

import { Content, Layout } from '../../../components/layout'
import Table from '../../../components/table/table'
import { Col, Dropdown, Input, Menu, Row, Space, TableProps, Tabs, Typography } from 'antd'
import { Instance, InstanceContext } from '../../context/instance'
import { PlusCircleOutlined } from '@ant-design/icons'
import { AddNewInstanceModal } from './instances.modal'
import Button from '../../../components/button'
import { DownOutlined } from '@ant-design/icons'
import { Entities, Entity } from '../../lib/entity-store/entity-store'
import { SearchOutlined } from '@ant-design/icons'
import { constants, instanceColumns } from './instances.constants'

const { Title, Text } = Typography
const { TabPane } = Tabs

interface ConvertedInstance {
    connectionString: JSX.Element
    action: JSX.Element
    accessKey: string
    accessSecret: string
}

const Instances: React.FC = () => {
    const [visible, setVisible] = useState(false)
    const [filter, setFilter] = useState('')

    const { removeEntity, entities: instanceList, addEntity } = useContext(InstanceContext)

    const deleteInstance = (deletedSession: Instance) => {
        removeEntity(deletedSession.id)
    }

    const convertInstances = (instanceList: Entities<Instance>): ConvertedInstance[] => {
        const instances = Object.values(instanceList)
        console.log('test', instances)
        if (!instances) {
            return []
        }
        const updateInstance = (key: string, value: string, instance: Instance) => {
            addEntity({
                ...instance,
                [key]: value,
            })
        }
        return instances
            .filter((instance): instance is Entity<Instance> => instance !== undefined && instance.key.includes(filter))
            .map((instance) => {
                const menu = (
                    <Menu>
                        <Menu.Item onClick={() => deleteInstance(instance)} key="1">
                            Remove
                        </Menu.Item>
                    </Menu>
                )

                return {
                    connectionString: (
                        <Text
                            editable={{
                                onChange: (value) => updateInstance('connectionString', value, instance),
                            }}
                        >
                            {instance.connectionString}
                        </Text>
                    ),
                    action: (
                        <Dropdown overlay={menu}>
                            <a href={`/workspaces/${instance.id.toLowerCase()}`}>
                                Connect <DownOutlined />
                            </a>
                        </Dropdown>
                    ),
                    key: (
                        <Text
                            editable={{
                                onChange: (value) => updateInstance('key', value, instance),
                            }}
                        >
                            {instance.key}
                        </Text>
                    ),
                    accessKey: instance.accessKey,
                    accessSecret: instance.accessSecret,
                }
            })
    }

    return (
        <React.Fragment>
            <AddNewInstanceModal visible={visible} setVisible={setVisible} />
            <Title level={3}>{constants.headline}</Title>
            <Layout>
                <Content>
                    <Row wrap={false} gutter={12}>
                        <Col flex="none">
                            <Button onClick={() => setVisible(true)} type="primary" icon={<PlusCircleOutlined />}>
                                Join
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

                    <Table dataSource={convertInstances(instanceList)} loading={false} columns={instanceColumns} />
                </Content>
            </Layout>
        </React.Fragment>
    )
}

export default Instances
