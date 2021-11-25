import React, { useContext, useState } from "react";

import AppNavigation from "../../../components/app-navigation";
import Button from "../../../components/button";
import Input from "../../../components/input";
import { Content, Layout } from "../../../components/layout";
import PageLayout from "../../../components/page-layout";
import Table from "../../../components/table/table";
import { Typography } from "antd";
import { Instance, InstanceContext } from "../../context/instance";
import { v4 as uuidv4 } from "uuid";
import { fetchAccessToken } from "../workspaces/api";
import {Modal} from "antd";
import { ReactState } from "../workspaces/modal";
import styled from "@emotion/styled";
import { PlusCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const SmallButton = styled(Button)`
  display: inline-block;
  width: fit-content;
  margin-bottom: 15px;
`;

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

  const AddNewInstanceModal = ({ visible, setVisible }: ReactState) => {
    const addInstance = (instance: Instance) => {
      fetchAccessToken(
        instance.connectionString,
        instance.accessKey,
        instance.accessSecret
      ).then((result) => {
        addEntity({ ...instance, id: uuidv4(), accessToken: result.token });
        setVisible(false);
      }).catch((err) => {
        Modal.error({
          title: 'Could not add this instance',
          content: 'Did you make sure you added the correct key and secret?',
        });
      })
    };

    const [currInstance, setInstance] = useState({
      id: "",
      connectionString: "",
      key: "",
      accessToken: "",
      accessSecret: "",
      accessKey: "",
    } as Instance);
  
    return (
      <Modal
        visible={visible}
        okText="Submit"
        onOk={() => addInstance(currInstance)}
        onCancel={() => setVisible(false)}
      >
        <Layout style={{ padding: "0px 50px", backgroundColor: "#FFF" }}>
          <Content>
            <Title style={{ marginBottom: "0px", fontSize: "24px" }}>
              Add a new instance
            </Title>
            <Text style={{ fontSize: "14px" }}>
              Connect to a Flagbase instance to begin managing your flags
            </Text>
            <Input
              onChange={(event) =>
                setInstance({
                  ...currInstance,
                  key: event.target.value,
                })
              }
              placeholder="Instance name"
              style={{ marginTop: "1em", marginBottom: "1em" }}
            />
            <Input
              onChange={(event) =>
                setInstance({
                  ...currInstance,
                  connectionString: event.target.value,
                })
              }
              placeholder="URL"
              style={{ marginBottom: "1em" }}
            />
            <Input
              onChange={(event) =>
                setInstance({
                  ...currInstance,
                  accessKey: event.target.value,
                })
              }
              placeholder="Access Key"
              style={{ marginBottom: "1em" }}
            />
            <Input
              onChange={(event) =>
                setInstance({
                  ...currInstance,
                  accessSecret: event.target.value,
                })
              }
              placeholder="Access Secret"
              style={{ marginBottom: "1em" }}
            />
          </Content>
        </Layout>
      </Modal>
    );
  };
  return (
    <PageLayout
      navigation={
        <AppNavigation title="Instances" hasBackIcon subMenuContent={{
          Instances: {
            content: [{
              title: 'Instance 1',
              href: '#'
            },
            {
              title: 'Instance 2',
              href: '#'
            },
            {
              title: 'Instance 3',
              href: '#'
            }]
          },
          Workspaces: {
            content: [{
              title: 'Workspace 1',
              href: '#'
            },
            {
              title: 'Workspace 2',
              href: '#'
            },
            {
              title: 'Workspace 3',
              href: '#'
            }]
          },
          Projects: {
            content: [{
              title: 'Project 1',
              href: '#'
            },
            {
              title: 'Project 2',
              href: '#'
            },
            {
              title: 'Project 3',
              href: '#'
            }]
          },
          Flags: {
            content: [{
              title: 'Flag 1',
              href: '#'
            },
            {
              title: 'Flag 2',
              href: '#'
            },
            {
              title: 'Flag 3',
              href: '#'
            }]
          }
        }} />
      }
    >
      <AddNewInstanceModal visible={visible} setVisible={setVisible} />
      <SmallButton
        onClick={() => setVisible(true)}
        type="primary"
        icon={<PlusCircleOutlined />}
      >
        Create a workspace
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
    </PageLayout>
  );
};

export default Instances;
