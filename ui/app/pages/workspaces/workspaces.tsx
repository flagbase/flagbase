import Title from 'antd/lib/typography/Title';
import React, { useState } from 'react';

import AppNavigation from '../../../components/app-navigation';
import { Content, Layout } from '../../../components/layout';
import PageLayout from '../../../components/page-layout';
import Table from '../../../components/table/table';

type WorkspaceAttributes = {
    key: string;
    name: string;
    description: string;
    tags: string;
}

type Workspace = {
    id: string;
    type: string;
    attributes: WorkspaceAttributes;
}

const Workspaces: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  return (
    <PageLayout
      navigation={
        <AppNavigation
          title="Workspaces"
          hasBackIcon
          subMenuContent={[]}

        />
      }
    >
      <Layout style={{ padding: '50px', paddingTop: '0px', backgroundColor: '#F9F9F9' }}>
        <Content style={{
          padding: '20px 50px',
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)'
        }}>
          <Title style={{ fontSize: '24px' }}>Join a workspace</Title>

          <Table dataSource={workspaces} columns={[
            {
              title: 'ID',
              dataIndex: 'ID',
              key: 'ID'
            },
            {
              title: 'Type',
              dataIndex: 'Type',
              key: 'Type'
            },
            {
              title: 'Action',
              dataIndex: 'action',
              key: 'connect'
            }
          ]} />
        </Content>
      </Layout>
    </PageLayout>
  );
};

export default Workspaces;
