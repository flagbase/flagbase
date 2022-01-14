import Title from "antd/lib/typography/Title";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Layout, notification } from 'antd';

import { Content } from "../../../components/layout";
import Table from "../../../components/table/table";
import { Instance, InstanceContext } from "../../context/instance";
import { WorkspaceContext } from "../../context/workspace";
import { fetchWorkspaces, Workspace } from "./api";
import { CreateWorkspace } from "./modal";
import Button from "../../../components/button";
import { Entities, Entity } from "../../lib/entity-store/entity-store";

export const convertWorkspaces = (workspaceList: Entities<Workspace>, instance: Instance) => {
  return Object.values(workspaceList).map((workspace: Entity<Workspace>, index: number) => {
    
    return {
      id: "",
      title:workspace.attributes.name,
      href: `/projects/${instance?.id}/${workspace?.id}`,
      name: workspace.attributes.name,
      description: workspace.attributes.description,
      tags: workspace.attributes.tags.join(', '),
      action: (
        <>
          <a href={`/projects/${instance?.id}/${workspace?.id}`}>Connect</a>
        </>
      ),
    };
  });
};


const Workspaces: React.FC = () => {
  const { instanceKey } = useParams<{ instanceKey: string }>();
  const [visible, setVisible] = useState(false);
  const { getEntity, setSelectedEntityId } = useContext(InstanceContext);
  const { entities: workspaces, addEntity, addEntities, setStatus, status} = useContext(
    WorkspaceContext
  );

  const instance = getEntity(instanceKey);
  if (!instance) {
    return <> </>
  } 

  useEffect(() => {
    setStatus('loading')
    setSelectedEntityId(instanceKey)
    fetchWorkspaces(instance.connectionString, instance.accessToken).then(
      (result: Workspace[]) => {
        addEntities(result);
      }
    ).catch(() => {
      notification.error({
        message: 'Could not load workspaces. Please try again.'
      })
    }).finally(() => {
      setStatus('loaded');
    })
  }, [visible]);

  return (
      <Layout
        style={{
          paddingTop: "0px",
          backgroundColor: "white",
        }}
      >
        <>
          <Button onClick={() => setVisible(true)} type="primary" icon={<PlusCircleOutlined />}>
            Create a workspace
          </Button>
          <Content
            style={{
              padding: "20px 50px",
              backgroundColor: "white",
              borderRadius: "15px",
              boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.25)",
            }}
          >
            <Title style={{ fontSize: "24px" }}>Join a workspace</Title>

            <Table  
              loading={status !== 'loaded'}
              dataSource={convertWorkspaces(
                workspaces,
                instance
              )}
              columns={[
                {
                  title: "Name",
                  dataIndex: "name",
                  key: "name",
                },
                {
                  title: "Description",
                  dataIndex: "description",
                  key: "description",
                },
                {
                  title: "Tags",
                  dataIndex: "tags",
                  key: "tags",
                },
                {
                  title: "Action",
                  dataIndex: "action",
                  key: "action",
                },
              ]}
            />
          </Content>
        </>
        <CreateWorkspace visible={visible} setVisible={setVisible} />

      </Layout>
  );
};

export default Workspaces;
