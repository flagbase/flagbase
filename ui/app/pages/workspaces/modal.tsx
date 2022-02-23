import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Input, Layout, Modal, Typography } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useContext, useState } from "react";
import { ModalLayout } from "../../../components/layout";
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

const defaultWorkspace = {
    name: '',
    description: '',
    tags: '',
  }

const CreateWorkspace = ({ visible, setVisible }: WorkspaceModal) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [workspace, setWorkspace] = useState(defaultWorkspace);

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
          workspace.tags.split(','),
          currInstance.accessToken
        ).then(() => {
            setVisible(false)
            setWorkspace(defaultWorkspace)
        } )
      }
    >
      <ModalLayout>
        <Content>
          <Title level={3}>
            Add a new workspace
          </Title>
          <Text>
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
          />
          <Input
            onChange={(event) =>
              setWorkspace({
                ...workspace,
                description: event.target.value,
              })
            }
            placeholder="Description"
          />
          <Input
            onChange={(event) =>
              setWorkspace({
                ...workspace,
                tags: event.target.value,
              })
            }
            placeholder="Tags (separate by comma)"
          />
        </Content>
      </ModalLayout>
    </Modal>
  );
};

export { CreateWorkspace, confirmDeleteWorkspace, ReactState };
