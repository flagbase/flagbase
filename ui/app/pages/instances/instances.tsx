import React, { useContext, useEffect, useState } from 'react'

import { Content, Layout } from '../../../components/layout'
import Table from '../../../components/table/table'
import { Col, Dropdown, Input, Menu, Row, Space, TableProps, Tabs, Typography } from 'antd'
import { Instance, InstanceContext } from '../../context/instance'
import { PlusCircleOutlined } from '@ant-design/icons'
import { AddNewInstanceModal } from './instances.modal'
import Button from '../../../components/button'
import { Entities, Entity } from '../../lib/entity-store/entity-store'
import { SearchOutlined } from '@ant-design/icons'
import { constants, instanceColumns } from './instances.constants'
import { Link } from 'react-router-dom'
import { fetchAccessToken } from '../workspaces/api'
import '../../tailwind/tailwind.css'
import { useQuery } from 'react-query'

type Instances = Instance[]

const { Title, Text } = Typography

interface ConvertedInstance {
    connectionString: JSX.Element
    accessKey: string
    accessSecret: string
}

export const getInstances = () => JSON.parse(localStorage.getItem('instances') || '[]')

const Instances: React.FC = () => {
    const [visible, setVisible] = useState(false)
    const [filter, setFilter] = useState('')

    const { removeEntity, addEntity } = useContext(InstanceContext)

    const { data: instanceList } = useQuery('instances', getInstances)

    useEffect(() => {
        if (instanceList) {
            for (const instance of instanceList as unknown as Instances) {
                if (instance && instance.expiresAt > new Date()) {
                    fetchAccessToken(instance.connectionString, instance.accessKey, instance.accessSecret).then(
                        (result) => {
                            setVisible(false)
                        }
                    )
                }
            }
        }
    }, [instanceList])

    const deleteInstance = (deletedSession: Instance) => {
        removeEntity(deletedSession.id)
    }

    const transformInstancesToTableDataSource = (instanceList: Instances): ConvertedInstance[] => {
        const instances = instanceList
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
            ?.filter(
                (instance): instance is Entity<Instance> => instance !== undefined && instance?.key?.includes(filter)
            )
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
                    key: (
                        <Dropdown overlay={menu}>
                            <Link to={`/${instance.key.toLowerCase()}/workspaces`}>{instance.key}</Link>
                        </Dropdown>
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
                    <div className="flex gap-3 items-center">
                        <div>
                            <Button onClick={() => setVisible(true)} type="primary" icon={<PlusCircleOutlined />}>
                                Join instance
                            </Button>
                        </div>
                        <div className="flex-auto">
                            <Input
                                onChange={(event) => setFilter(event.target.value)}
                                placeholder="Search"
                                prefix={<SearchOutlined />}
                            />
                        </div>
                    </div>

                    <Table
                        dataSource={transformInstancesToTableDataSource(instanceList)}
                        loading={false}
                        columns={instanceColumns}
                    />
                </Content>
            </Layout>
        </React.Fragment>
    )
}

export default Instances
