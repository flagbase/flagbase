import styled from "@emotion/styled";
import { Button } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { HomeFilled, PlusCircleOutlined } from "@ant-design/icons";

import AppNavigation from "../../../components/app-navigation";
import { Content, Layout } from "../../../components/layout";
import PageLayout from "../../../components/page-layout";
import Table from "../../../components/table/table";
import { InstanceContext } from "../../context/instance";
import { Workspace, WorkspaceContext } from "../../context/workspace";
import { listWorkspaces } from "./api";
import { confirmDeleteWorkspace, CreateWorkspace } from "./modal";

const SmallButton = styled(Button)`
  display: inline-block;
  width: fit-content;
  margin-bottom: 15px;
`;

const Workspaces: React.FC = () => {
  const { instanceKey } = useParams<{ instanceKey: string }>();
  const [visible, setVisible] = useState(false);
  const { getEntity } = useContext(InstanceContext);
  const { entities: workspaces, addEntity, removeEntity } = useContext(
    WorkspaceContext
  );
  const instance = getEntity(instanceKey);
  if (!instance) {
    return <> </>
  } 

  console.log("TEST", workspaces)
  useEffect(() => {
    listWorkspaces(instance.connectionString, instance.accessToken).then(
      (result: Workspace[]) => {
        result.forEach((result) => addEntity(result));
      }
    );
  }, []);

  const convertWorkspaces = (workspaceList: Workspace[]) => {
    return workspaceList.map((workspace: Workspace, index: number) => {
      return {
        id: "",
        name: workspace.attributes.name,
        description: workspace.attributes.description,
        tags: workspace.attributes.tags,
        action: (
          <>
            <a href={`/workspaces/${workspace.id.toLowerCase()}`}>Connect</a>
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

  return (
    <PageLayout
      navigation={
        <AppNavigation title="Workspaces" hasBackIcon subMenuContent={{
          Home: {
            title: <HomeFilled />,
            content: [{ 
              title: 'test',
              href: '#',
            }]  
          },
          Workspace: {
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
          Project: {
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
              dataSource={convertWorkspaces(
                Object.values((workspaces as unknown) as {})
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
      </Layout>
      <CreateWorkspace visible={visible} setVisible={setVisible} />
    </PageLayout>
  );
};

export default Workspaces;
