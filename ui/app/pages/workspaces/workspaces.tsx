import React from 'react'
import { useParams } from 'react-router-dom'
import { Alert, Space, Typography } from 'antd'
import { constants } from './workspace.constants'
import { constants as instanceConstants } from '../instances/instances.constants'
import { Tabs } from 'antd'
import MainWorkspaces from './workspaces.main'
import { Content, Layout } from '../../../components/layout'
import Instances, { useInstances } from '../instances/instances'

const { TabPane } = Tabs
const { Title } = Typography

const Workspaces: React.FC = () => {
    const { instanceKey } = useParams<{ instanceKey: string }>()
    if (!instanceKey) {
        return <Alert message={instanceConstants.error} type="error" />
    }

    const { data: instances } = useInstances({
        select: (instances: Instances) => {
            return instances.filter((instance) => instance.key.toLocaleLowerCase() === instanceKey.toLocaleLowerCase())
        },
    })

    const instance = instances && instances.length > 0 ? instances[0] : null
    if (!instance || !instances) {
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
                            <MainWorkspaces instances={instances} />
                        </Content>
                    </Layout>
                </TabPane>
            </Tabs>
        </React.Fragment>
    )
}

export default Workspaces
