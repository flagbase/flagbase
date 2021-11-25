import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import React, { useState } from "react";
import { deleteWorkspace } from "./api";

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
    content:
      "When clicked the OK button, this dialog will be closed after 1 second",
    onOk() {
      deleteWorkspace(url, workspaceKey, accessToken);
    },
    onCancel() {},
  });
}

const CreateWorkspace = ({ visible, setVisible }: WorkspaceModal) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const showModal = () => {
    setVisible(true);
  };

  return (
    <Modal
      title="Title"
      visible={visible}
      confirmLoading={confirmLoading}
      onCancel={() => setVisible(false)}
    >
      <p>{modalText}</p>
    </Modal>
  );
};

export { CreateWorkspace, confirmDeleteWorkspace, ReactState };
