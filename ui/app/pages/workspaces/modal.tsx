import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Input, Layout, Modal, Typography } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useContext, useState } from "react";
import { InstanceContext } from "../../context/instance";
import { createWorkspace, deleteWorkspace } from "./api";

const { Title, Text } = Typography;

const { confirm } = Modal;

interface ReactState {
  visible: boolean;
  setVisible(data: boolean): void;
}

interface WorkspaceModal {
  visible: boolean;
  setVisible(data: boolean): void;
}

function confirmDeleteWorkspace(
  workspaceName: string,
  url: string,
  workspaceKey: string,
  accessToken: string
) {
  confirm({
    title: `Are you sure you want to delete ${workspaceName}?`,
    icon: <ExclamationCircleOutlined />,
    onOk() {
      deleteWorkspace(url, workspaceKey, accessToken);
    },
    onCancel() {},
  });
}

const CreateWorkspace = ({ visible, setVisible }: WorkspaceModal) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [workspace, setWorkspace] = useState({
    name: '',
    description: '',
    tags: '',
  });

  const {
    addEntity,
    getEntity,
    selectedEntityId,
  } = useContext(InstanceContext);

  const currInstance = getEntity(selectedEntityId || "");
  if (!currInstance) {
    return <></> 
  }

  return (
    <Modal
      title="Workspace"
      visible={visible}
      confirmLoading={confirmLoading}
      onCancel={() => setVisible(false)}
      onOk={() =>
        createWorkspace(
          currInstance.connectionString,
          workspace.name,
          workspace.description,
          workspace.tags,
          currInstance.accessToken
        ).then(() => setVisible(false))
      }
    >
      <Layout style={{ padding: "0px 50px", backgroundColor: "#FFF" }}>
        <Content>
          <Title style={{ marginBottom: "0px", fontSize: "24px" }}>
            Add a new workspace
          </Title>
          <Text style={{ fontSize: "14px" }}>
            Connect to a Flagbase workspace to begin managing your flags
          </Text>
          <Input
            onChange={(event) =>
              setWorkspace({
                ...workspace,
                name: event.target.value,
              })
            }
            placeholder="Workspace name"
            style={{ marginTop: "1em", marginBottom: "1em" }}
          />
          <Input
            onChange={(event) =>
              setWorkspace({
                ...workspace,
                description: event.target.value,
              })
            }
            placeholder="Description"
            style={{ marginBottom: "1em" }}
          />
          <Input
            onChange={(event) =>
              setWorkspace({
                ...workspace,
                tags: event.target.value,
              })
            }
            placeholder="Tags"
            style={{ marginBottom: "1em" }}
          />
        </Content>
      </Layout>
    </Modal>
  );
};

export { CreateWorkspace, confirmDeleteWorkspace, ReactState };
