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
import { Link, useLoaderData, useOutletContext } from 'react-router-dom'
import { fetchAccessToken } from '../workspaces/api'
import '../../tailwind/tailwind.css'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { axios } from '../../lib/axios'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import Input from '../../../components/input'
import EmptyProject from '../../../components/empty-state/empty-state'

type Instances = Instance[]

const { Text } = Typography

interface ConvertedInstance {
    connectionString: JSX.Element
    accessKey: string
    accessSecret: string
}

export const useUpdateInstance = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (instance: Instance & { newKey: string }) => {
            axios.defaults.baseURL = instance.connectionString
            const result = await fetchAccessToken(instance.connectionString, instance.accessKey, instance.accessSecret)
            const currInstances = JSON.parse(localStorage.getItem('instances') || '[]')
            const filteredInstances = currInstances.filter((i: Instance) => i.key !== instance.key)
            localStorage.setItem(
                'instances',
                JSON.stringify([...filteredInstances, { ...instance, key: instance.newKey }])
            )
            return { ...instance, expiresAt: result.expiresAt }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['instances'])
        },
    })
    return mutation
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

export const useRemoveInstance = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (instance: Omit<Instance, 'expiresAt'>) => {
            axios.defaults.baseURL = instance.connectionString
            const result = await fetchAccessToken(instance.connectionString, instance.accessKey, instance.accessSecret)
            const currInstances = JSON.parse(localStorage.getItem('instances') || '[]')
            const filteredInstances = currInstances.filter((i: Instance) => i.key !== instance.key)
            localStorage.setItem('instances', JSON.stringify(filteredInstances))
            return { ...instance, expiresAt: result.expiresAt }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['instances'])
        },
    })
    return mutation
}

export const useInstance = (instanceKey: string) => {
    const { data: instances } = useInstances({
        refetchOnWindowFocus: false,
    })
    const instance = instances?.find((i) => i.key.toLocaleLowerCase() === instanceKey.toLocaleLowerCase())
    return instance
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

    const instances = useLoaderData() as Instances
    console.log('instances', instances)

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

    const transformInstancesToTableDataSource = (instanceList: Instances): ConvertedInstance[] => {
        const instances = instanceList
        if (!instances) {
            return []
        }
        return instances
            ?.filter(
                (instance): instance is Entity<Instance> => instance !== undefined && instance?.key?.includes(filter)
            )
            .map((instance) => {
                return {
                    name: <Link to={`/${instance.key.toLowerCase()}/workspaces`}>{instance.key}</Link>,
                    connectionString: <Text>{instance.connectionString}</Text>,
                    key: instance.key,
                    accessKey: instance.accessKey,
                    accessSecret: instance.accessSecret,
                }
            })
    }

    return (
        <div className="mt-5">
            <AddNewInstanceModal visible={visible} setVisible={setVisible} />
            {instances && instances.length > 0 && (
                <div className="flex flex-col-reverse md:flex-row gap-3 items-stretch pb-5">
                    <Button onClick={() => setVisible(true)} type="button" suffix={PlusCircleIcon}>
                        Join instance
                    </Button>
                    <div className="flex-auto">
                        <Input
                            onChange={(event) => setFilter(event.target.value)}
                            placeholder="Search"
                            prefix={SearchOutlined}
                        />
                    </div>
                </div>
            )}
            {instances && (
                <Table
                    dataSource={transformInstancesToTableDataSource(instances)}
                    loading={false}
                    columns={instanceColumns}
                    emptyState={
                        <EmptyProject
                            title="You haven't added an instance yet"
                            description="Add an instance now"
                            cta={
                                <Button
                                    className="py-2"
                                    onClick={() => setVisible(true)}
                                    type="button"
                                    suffix={PlusCircleIcon}
                                >
                                    Join instance
                                </Button>
                            }
                        />
                    }
                />
            )}
        </div>
    )
}

export default Instances
