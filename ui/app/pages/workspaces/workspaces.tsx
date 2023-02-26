import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Alert, Space, Typography } from 'antd'
import { InstanceContext } from '../../context/instance'
import { constants } from './workspace.constants'
import { constants as instanceConstants } from '../instances/instances.constants'
import { Tabs } from 'antd'
import MainWorkspaces from './workspaces.main'
import EditInstance from './workspaces.edit'
import { Content, Layout } from '../../../components/layout'
import { useQuery } from 'react-query'
import Instances, { getInstances } from '../instances/instances'

const { TabPane } = Tabs
const { Title } = Typography

const Workspaces: React.FC = () => {
    const { instanceKey } = useParams<{ instanceKey: string }>()
    if (!instanceKey) {
        return <Alert message={instanceConstants.error} type="error" />
    }

    const { addEntity, removeEntity } = useContext(InstanceContext)

    const { data: instanceList } = useQuery<Instances>('instances', getInstances, {
        select: (instances) => {
            return instances.filter((instance) => instance.key === instanceKey)
        },
    })

    const instance = instanceList && instanceList.length > 0 ? instanceList[0] : null
    if (!instance) {
        return <Alert message={instanceConstants.error} type="error" />
    }

    return (
        <React.Fragment>
            <Space>
                <Title level={3}>{instance.key} | </Title>
                <Title level={3}> {constants.join}</Title>
            </Space>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Workspaces" key="1">
                    <Layout>
                        <Content>
                            <MainWorkspaces />
                        </Content>
                    </Layout>
                </TabPane>
                <TabPane tab="Modify Instance" key="2">
                    <Layout>
                        <Content>
                            <EditInstance instance={instance} addEntity={addEntity} removeEntity={removeEntity} />
                        </Content>
                    </Layout>
                </TabPane>
            </Tabs>
        </React.Fragment>
    )
}

export default Workspaces
