import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Input, Layout, Modal, Typography } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { ModalLayout } from "../../../components/layout";
import { InstanceContext } from "../../context/instance";
import { createProject, deleteProject } from "./api";

const { Title, Text } = Typography;
const { confirm } = Modal;

interface WorkspaceModal {
  visible: boolean;
  setVisible(data: boolean): void;
}

function confirmDeleteProject(
  workspaceName: string,
  url: string,
  workspaceKey: string,
  accessToken: string
) {
  confirm({
    title: `Are you sure you want to delete ${workspaceName}?`,
    icon: <ExclamationCircleOutlined />,
    onOk() {
      deleteProject(url, workspaceKey, accessToken);
    },
    onCancel() {},
  });
}

const defaultProject = {
    name: '',
    description: '',
    tags: '',
  }

const CreateProject = ({ visible, setVisible }: WorkspaceModal) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [project, setProject] = useState(defaultProject);
  const { workspaceKey } = useParams<{ workspaceKey: string }>();
  if (!workspaceKey) {
      return
  }

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
        createProject(
          currInstance.connectionString,
          project.name,
          project.description,
          project.tags.split(','),
          currInstance.accessToken,
          workspaceKey
        ).then(() => {
            setVisible(false)
            setProject(defaultProject)
        } )
      }
    >
      <ModalLayout>
        <Content>
          <Title level={3}>
            Add a new project
          </Title>
          <Text>
            Connect to a Flagbase project to begin managing your flags
          </Text>
          <Input
            onChange={(event) =>
              setProject({
                ...project,
                name: event.target.value,
              })
            }
            placeholder="Project name"
          />
          <Input
            onChange={(event) =>
              setProject({
                ...project,
                description: event.target.value,
              })
            }
            placeholder="Description"
          />
          <Input
            onChange={(event) =>
              setProject({
                ...project,
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

export { CreateProject, confirmDeleteProject };
