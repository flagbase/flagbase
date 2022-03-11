import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Alert, Typography } from 'antd'
import { InstanceContext } from '../../context/instance'
import { constants } from './workspace.constants'
import { constants as instanceConstants } from '../instances/instances.constants'
import { Tabs } from 'antd'
import MainWorkspaces from './workspaces.main'
import EditInstance from './workspaces.edit'
import { Content, Layout } from '../../../components/layout'

const { TabPane } = Tabs
const { Title } = Typography

const Workspaces: React.FC = () => {
    const { instanceKey } = useParams<{ instanceKey: string }>()
    if (!instanceKey) {
        return <Alert message={instanceConstants.error} type="error" />
    }

    const { getEntity, addEntity, removeEntity } = useContext(InstanceContext)
    const instance = getEntity(instanceKey)
    if (!instance) {
        return <Alert message={instanceConstants.error} type="error" />
    }

    return (
        <React.Fragment>
            <Title level={3}>{constants.join}</Title>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Workspaces" key="1">
                    <Layout>
                        <Content>
                            <MainWorkspaces />
                        </Content>
                    </Layout>
                </TabPane>
                <TabPane tab="Edit" key="2">
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
