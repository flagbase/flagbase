import React, { useContext, useEffect, useState } from 'react'

import { Layout } from '../../../components/layout'
import Table from '../../../components/table/table'
import { Dropdown, Menu, Typography } from 'antd'
import { Instance, InstanceContext } from '../../context/instance'
import { AddNewInstanceModal } from './instances.modal'
import Button from '../../../components/button'
import { Entity } from '../../lib/entity-store/entity-store'
import { SearchOutlined } from '@ant-design/icons'
import { constants, instanceColumns } from './instances.constants'
import { Link } from 'react-router-dom'
import { fetchAccessToken } from '../workspaces/api'
import '../../tailwind/tailwind.css'
import { useMutation, useQuery } from 'react-query'
import { axios } from '../../lib/axios'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import Input from '../../../components/input'

type Instances = Instance[]

const { Title, Text } = Typography

interface ConvertedInstance {
    connectionString: JSX.Element
    accessKey: string
    accessSecret: string
}

export const useAddInstance = () => {
    const mutation = useMutation({
        mutationFn: async (instance: Omit<Instance, 'expiresAt'>) => {
            axios.defaults.baseURL = instance.connectionString
            const result = await fetchAccessToken(instance.connectionString, instance.accessKey, instance.accessSecret)
            const currInstances = JSON.parse(localStorage.getItem('instances') || '[]')
            localStorage.setItem(
                'instances',
                JSON.stringify([
                    ...currInstances,
                    {
                        ...instance,
                        expiresAt: result.expiresAt,
                        id: result.id,
                        accessToken: result.accessToken,
                    },
                ])
            )
            return { ...instance, expiresAt: result.expiresAt }
        },
    })
    return mutation
}

export const useInstances = (options?: any) => {
    // Define a query to fetch the instances object from the server
    const query = useQuery<Instances>(['instances'], getInstances, {
        ...options,
    })

    return query
}

export const getInstances = () => JSON.parse(localStorage.getItem('instances') || '[]')

const Instances: React.FC = () => {
    const [visible, setVisible] = useState(false)
    const [filter, setFilter] = useState('')

    const { removeEntity, addEntity } = useContext(InstanceContext)

    const { data: instances } = useInstances()

    useEffect(() => {
        if (instances) {
            for (const instance of instances) {
                if (instance && instance.expiresAt < new Date()) {
                    fetchAccessToken(instance.connectionString, instance.accessKey, instance.accessSecret).then(
                        (result) => {
                            setVisible(false)
                        }
                    )
                }
            }
        }
    }, [instances])

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
                        <Menu.Item onClick={() => deleteInstance(instance)} key={`${instance.id}_remove`}>
                            Remove
                        </Menu.Item>
                    </Menu>
                )

                return {
                    name: (
                        <Dropdown key={`${instance.id}_${instance.connectionString}`} overlay={menu}>
                            <Link to={`/${instance.key.toLowerCase()}/workspaces`}>{instance.key}</Link>
                        </Dropdown>
                    ),
                    connectionString: (
                        <Text
                            editable={{
                                onChange: (value) => updateInstance('connectionString', value, instance),
                            }}
                        >
                            {instance.connectionString}
                        </Text>
                    ),
                    key: instance.key,
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
                <div className="flex flex-col-reverse md:flex-row gap-3 items-center pb-5">
                    <div>
                        <Button
                            onClick={() => setVisible(true)}
                            type="button"
                            suffix={<PlusCircleIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />}
                        >
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
                {instances && (
                    <Table
                        dataSource={transformInstancesToTableDataSource(instances)}
                        loading={false}
                        columns={instanceColumns}
                    />
                )}
            </Layout>
        </React.Fragment>
    )
}

export default Instances
