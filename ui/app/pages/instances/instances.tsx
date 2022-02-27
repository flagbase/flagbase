import React, { useContext, useState } from "react";

import { Content, Layout } from "../../../components/layout";
import Table from "../../../components/table/table";
import { Dropdown, Menu, TableProps, Typography } from "antd";
import { Instance, InstanceContext } from "../../context/instance";
import { PlusCircleOutlined } from "@ant-design/icons";
import { AddNewInstanceModal } from "./instances.modal";
import Button from "../../../components/button";
import { DownOutlined } from '@ant-design/icons';
import { Entities, Entity } from "../../lib/entity-store/entity-store";

const { Title, Text } = Typography;

const Instances: React.FC = () => {
    const [visible, setVisible] = useState(false);

    const { removeEntity, entities: instanceList, addEntity } = useContext(
        InstanceContext
    );

    const deleteInstance = (deletedSession: Instance) => {
        removeEntity(deletedSession.id);
    };

    const convertInstances = (instanceList: Entities<Instance>) => {
        const instances = Object.values(instanceList)
        console.log('test', instances)
        if (!instances) {
            return {
                data: 'test'
            };
        }
        return instances.map((instance) => {
            if (!instance) {
                return;
            }
            const menu = <Menu>
                <Menu.Item onClick={() => deleteInstance(instance)} key="1">Remove</Menu.Item>
            </Menu>

            const updateInstance = (key: string, value: string) => {
                addEntity({
                    ...instance,
                    [key]: value
                })
            }

            return {
                connectionString: <Text editable={{ onChange: (value) => updateInstance('connectionString', value) }}>{instance.connectionString}</Text>,
                action: (
                    <Dropdown overlay={menu}>
                        <a href={`/workspaces/${instance.id.toLowerCase()}`}>Connect{' '}<DownOutlined /></a>
                    </Dropdown>
                ),
                key: <Text editable={{ onChange: (value) => updateInstance('key', value) }}>{instance.key}</Text>,
                accessKey: instance.accessKey,
                accessSecret: instance.accessSecret,
            };
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
            <Layout
            >
                <Content
                >
                    <Title level={3}>Connect to an instance</Title>

                    <Table
                        dataSource={convertInstances(
                           instanceList
                        )}
                        loading={false}
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
                </Content>
            </Layout>
        </React.Fragment>
    );
};

export default Instances;
