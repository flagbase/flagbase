import Title from "antd/lib/typography/Title";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import AppNavigation from "../../../components/app-navigation";
import { Content, Layout } from "../../../components/layout";
import PageLayout from "../../../components/page-layout";
import Table from "../../../components/table/table";
import { InstanceContext } from "../../context/instance";
import { WorkspaceContext } from "../../context/workspace";
import { listWorkspaces } from "./api";

type WorkspaceAttributes = {
  key: string;
  name: string;
  description: string;
  tags: string;
};

const Workspaces: React.FC = () => {
  const { instanceKey } = useParams<{ instanceKey: string }>();

  const { getEntity, addEntities } = useContext(InstanceContext);
  const { entities: workspaces } = useContext(WorkspaceContext);

  useEffect(() => {
    const instance = getEntity(instanceKey);
    if (!instance) {
      return;
    }
    listWorkspaces(instance.connectionString, instance.accessToken).then((result) => {
      addEntities(result)
    })
  }, []);
  return (
    <PageLayout
      navigation={
        <AppNavigation title="Workspaces" hasBackIcon subMenuContent={[]} />
      }
    >
      <Layout
        style={{
          padding: "50px",
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
          <Title style={{ fontSize: "24px" }}>Join a workspace</Title>

          <Table
            dataSource={Object.values((workspaces as unknown) as {})}
            columns={[
              {
                title: "ID",
                dataIndex: "ID",
                key: "ID",
              },
              {
                title: "Type",
                dataIndex: "Type",
                key: "Type",
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

export default Workspaces;
