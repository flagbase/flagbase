import React, { useState } from 'react';
import { Tabs as AntdTabs, TabsProps as AntdTabsProps, Typography  } from "antd";

const { TabPane } = AntdTabs;
const { Title, Paragraph } = Typography;

export type TabsProps = {
    defaultActiveKey: string
  } & AntdTabsProps;

  
const Tabs: React.FC<TabsProps> = ({ defaultActiveKey }) => {
    const [activeKey, setActiveKey] = useState("1")
  return (
    <AntdTabs onTabClick={(key) => setActiveKey(key)} defaultActiveKey={defaultActiveKey} activeKey={activeKey}>
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
  )
};

export default Tabs;
