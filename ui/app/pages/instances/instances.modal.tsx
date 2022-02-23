import { Input, Layout, Modal, Typography } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useContext } from "react";
import { useState } from "react";
import { Instance, InstanceContext } from "../../context/instance";
import { fetchAccessToken } from "../workspaces/api";
import { ReactState } from "../workspaces/modal";
import { v4 as uuidv4 } from "uuid";
import { ModalLayout } from "../../../components/layout";

export const AddNewInstanceModal = ({ visible, setVisible }: ReactState) => {
    const { Title, Text } = Typography;
    const { addEntity } = useContext(
        InstanceContext
      );
    
    const addInstance = (instance: Instance) => {
      fetchAccessToken(
        instance.connectionString,
        instance.accessKey,
        instance.accessSecret
      ).then((result) => {
        addEntity({ ...instance, id: uuidv4(), accessToken: result.token, expiresAt: result.expiresAt });
        setVisible(false);
      }).catch(() => {
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
        <ModalLayout>
          <Content>
            <Title level={3}>
              Add a new instance
            </Title>
            <Text>
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
            />
            <Input
              onChange={(event) =>
                setInstance({
                  ...currInstance,
                  connectionString: event.target.value,
                })
              }
              placeholder="URL"
            />
            <Input
              onChange={(event) =>
                setInstance({
                  ...currInstance,
                  accessKey: event.target.value,
                })
              }
              placeholder="Access Key"
            />
            <Input
              onChange={(event) =>
                setInstance({
                  ...currInstance,
                  accessSecret: event.target.value,
                })
              }
              placeholder="Access Secret"
            />
          </Content>
        </ModalLayout>
      </Modal>
    );
  };

