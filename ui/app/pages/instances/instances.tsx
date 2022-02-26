import React, { useContext, useState } from "react";

import { Content, Layout } from "../../../components/layout";
import Table from "../../../components/table/table";
import { Divider, Row, Space, Tabs, Typography } from "antd";
import { Instance, InstanceContext } from "../../context/instance";
import { PlusCircleOutlined } from "@ant-design/icons";
import { AddNewInstanceModal } from "./instances.modal";
import Button from "../../../components/button";

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const instancesTabConfiguration = {
    "key": {
        name: "",
        component: Title
    },
    "connectionString": {
        name: "URL",
        component: Paragraph
    },
    "accessKey": {
        name: "Access Key",
        component: Paragraph
    }
}

interface InstanceTab {
    key: {
        name: string
    },
    connectionString: {
        name: string
    },
    accessKey: {
        name: string
    }
}

const Instances: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [activeInstance, setActiveInstance] = useState<Instance | undefined>(undefined);
    const [activeKey, setActiveKey] = useState("1")
    const { entities: instanceList, removeEntity } = useContext(
        InstanceContext
    );

    const editInstance = (key: string, value: string) => {
        if (!activeInstance) {
            return;
        }
        setActiveInstance({ ...activeInstance, [key]: value })
    };

    const removeInstance = (instance: Instance) => {
        removeEntity(instance.id)
        setActiveInstance(undefined)
        setActiveKey("1")
    }
    const openEditTab = (instance: Instance) => {
        setActiveKey("2")
        setActiveInstance(instance)
    }

    const convertInstances = (instanceList: Instance[]) => {
        return instanceList.map((instance: Instance, index: number) => {
            return {
                id: "",
                connectionString: instance.connectionString,
                action: (
                    <>
                        <a href={`/workspaces/${instance.id.toLowerCase()}`}>Connect</a>
                        <span> | </span>
                        <a onClick={() => openEditTab(instance)}>Edit</a>
                    </>
                ),
                key: instance.key,
                accessKey: instance.accessKey,
                accessSecret: instance.accessSecret,
                accessToken: "",
            } as Instance;
        });
    };

    return (
        <React.Fragment>
            <AddNewInstanceModal visible={visible} setVisible={setVisible} />
            <Button
                onClick={() => setVisible(true)}
                type="primary"
                icon={<PlusCircleOutlined />}
            >
                Join a new instance
      </Button>
            <Layout>
                <Content>
                    <Tabs onTabClick={(key) => setActiveKey(key)} defaultActiveKey="1" activeKey={activeKey}>
                        <TabPane tab="Connect" key="1">
                            <Title level={3}>Connect to an instance</Title>
                            <Table
                                loading={false}
                                dataSource={convertInstances(
                                    Object.values((instanceList as unknown) as {})
                                )}
                                columns={[
                                    {
                                        title: "Name",
                                        dataIndex: "key",
                                        key: "key",
                                    },
                                    {
                                        title: "URL",
                                        dataIndex: "connectionString",
                                        key: "connectionString",
                                    },
                                    {
                                        title: "Action",
                                        dataIndex: "action",
                                        key: "connect",
                                    },
                                ]}
                            />
                        </TabPane>
                        {activeInstance && <TabPane tab="Edit" key="2">
                            <React.Fragment>
                                {Object.keys(instancesTabConfiguration).map((key) =>
                                    <Row>
                                        {instancesTabConfiguration[key as keyof InstanceTab].name ?

                                            (<>
                                                <Space align="baseline" split={<Divider type="vertical" />}>
                                                    <Title level={5}>{instancesTabConfiguration[key as keyof InstanceTab].name}</Title>
                                                    <Paragraph editable={{ onChange: (value) => editInstance(key, value) }}>{activeInstance[key as keyof InstanceTab]}</Paragraph>
                                                </Space> </>)
                                            :
                                            (<div>
                                                <Paragraph editable={{ onChange: (value) => editInstance(key, value) }}>{activeInstance[key as keyof InstanceTab]}</Paragraph>
                                            </div>)}
                                    </Row>)}
                                <Row>
                                    <Button onClick={() => removeInstance(activeInstance)}>Remove Instance</Button>
                                </Row>
                            </React.Fragment>
                        </TabPane>
                        }
                    </Tabs>
                </Content>
            </Layout>
        </React.Fragment>
    );
};

export default Instances;
