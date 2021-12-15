import styled from "@emotion/styled";
import { Button } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";
import { notification } from 'antd';

import { Content, Layout } from "../../../components/layout";
import Table from "../../../components/table/table";
import { Instance, InstanceContext } from "../../context/instance";
import { Workspace, WorkspaceContext } from "../../context/workspace";
import { fetchWorkspaces } from "./api";
import { confirmDeleteWorkspace, CreateWorkspace } from "./modal";

const SmallButton = styled(Button)`
  display: inline-block;
  width: fit-content;
  margin-bottom: 15px;
`;

export const convertWorkspaces = (workspaceList: Workspace[], instance: Instance) => {
  return workspaceList.map((workspace: Workspace, index: number) => {
    return {
      id: "",
      title:workspace.attributes.name,
      href: `/workspaces/${workspace.id.toLowerCase()}`,
      name: workspace.attributes.name,
      description: workspace.attributes.description,
      tags: workspace.attributes.tags,
      action: (
        <>
          <a href={`/projects/${instance?.id}/${workspace?.id}`}>Connect</a>
          <span> | </span>
          <a
            onClick={() =>
              confirmDeleteWorkspace(
                workspace.attributes.name,
                instance.connectionString,
                workspace.attributes.key,
                instance.accessToken
              )
            }
          >
            Delete
          </a>
        </>
      ),
    };
  });
};


const Workspaces: React.FC = () => {
  const { instanceKey } = useParams<{ instanceKey: string }>();
  const [visible, setVisible] = useState(false);
  const { getEntity } = useContext(InstanceContext);
  const { entities: workspaces, addEntity, setStatus, status} = useContext(
    WorkspaceContext
  );

  const instance = getEntity(instanceKey);
  if (!instance) {
    return <> </>
  } 


  useEffect(() => {
    setStatus('loading')
    fetchWorkspaces(instance.connectionString, instance.accessToken).then(
      (result: Workspace[]) => {
        result.forEach((workspace) => {
          addEntity(workspace)
        });
      }
    ).catch(() => {
      notification.error({
        message: 'Could not load workspaces. Please try again.'
      })
    }).finally(() => {
      setStatus('loaded');
    })
  }, []);

  return (
    <React.Fragment
    >
      <Layout
        style={{
          paddingTop: "0px",
          backgroundColor: "#F9F9F9",
        }}
      >
        <>
          <SmallButton onClick={() => setVisible(true)} type="primary" icon={<PlusCircleOutlined />}>
            Create a workspace
          </SmallButton>
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
                Object.values((workspaces as unknown) as {}),
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
    </React.Fragment>
  );
};

export default Workspaces;
