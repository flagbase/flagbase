import React, { useContext, useState } from "react";

import { Content, Layout } from "../../../components/layout";
import Table from "../../../components/table/table";
import { Typography } from "antd";
import { Instance, InstanceContext } from "../../context/instance";
import { PlusCircleOutlined } from "@ant-design/icons";
import { AddNewInstanceModal } from "./instances.modal";
import { SmallButton } from "./instances.style";

const { Title } = Typography;

const Instances: React.FC = () => {
  const [visible, setVisible] = useState(false);

  const { addEntity, removeEntity, entities: instanceList } = useContext(
    InstanceContext
  );

  const deleteInstance = (deletedSession: Instance) => {
    removeEntity(deletedSession.id);
  };

  const convertInstances = (instanceList: Instance[]) => {
    return instanceList.map((instance: Instance, index: number) => {
      return {
        id: "",
        connectionString: instance.connectionString,
        action: (
          <>
            <a href={`/workspaces/${instance.id.toLowerCase()}`}>Connect</a>
            <span> | </span>
            <a onClick={() => deleteInstance(instance)}>Delete</a>
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
      <SmallButton
        onClick={() => setVisible(true)}
        type="primary"
        icon={<PlusCircleOutlined />}
      >
        Join a new instance
      </SmallButton>
      <Layout
        style={{
          paddingTop: "0px",
          backgroundColor: "#F9F9F9",
        }}
      >
        <Content
          style={{
            padding: "20px 50px",
            backgroundColor: "white",
            borderRadius: "15px",
            boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Title style={{ fontSize: "24px" }}>Connect to an instance</Title>

          <Table
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
        </Content>
      </Layout>
    </React.Fragment>
  );
};

export default Instances;
