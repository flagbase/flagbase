import React, { useState } from 'react';

import AppNavigation from '../../../components/app-navigation';
import Button from '../../../components/button';
import Input from '../../../components/input';
import { Content, Layout } from '../../../components/layout';
import PageLayout from '../../../components/page-layout';
import Table from '../../../components/table/table';

import { Typography } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

type sessionProps = {
    name: string;
    url: string;
}
const Instances: React.FC = () => {
  const [sessionList, setSessionList] = useState<sessionProps[]>(JSON.parse(localStorage.getItem('sessions') || '{}'));
  const [currInstance, setInstance] = useState({
    name: '',
    url: ''
  });

  const addInstance = () => {
    localStorage.setItem('sessions', JSON.stringify([...sessionList, currInstance]));
    setSessionList([...sessionList, currInstance]);
  };

  const convertInstances = (instanceList: sessionProps[]) => {
    return instanceList.map((instance:sessionProps) => {
      return {
        name: instance.name,
        url: instance.url,
        action: <a href={instance.url}>Connect</a>
      };
    });
  };
  return (
    <PageLayout
      navigation={
        <AppNavigation
          title="Instances"
          hasBackIcon
          subMenuContent={[]}
        />
      }
    >
      <Layout style={{ padding: '50px', backgroundColor: '#F9F9F9' }}>
        <Content style={{
          padding: '20px 50px',
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)'
        }}>
          <Title style={{ marginBottom: '0px', fontSize: '24px' }}>Add a new instance</Title>
          <Text style={{ fontSize: '14px' }}>Connect to a Flagbase instance to begin managing your flags</Text>
          <Input onChange={(event) => setInstance({
            ...currInstance,
            name: event.target.value
          })} placeholder="Instance name" style={{ marginTop: '1em', marginBottom: '1em' }} />
          <Input onChange={(event) => setInstance({
            ...currInstance,
            url: event.target.value
          })} placeholder="URL" style={{ marginBottom: '1em' }} />
          <Button onClick={() => addInstance()} type="primary" style={{ marginBottom: '1em' }}>Submit</Button>
        </Content>
      </Layout>

      <Layout style={{ padding: '50px', paddingTop: '0px', backgroundColor: '#F9F9F9' }}>
        <Content style={{
          padding: '20px 50px',
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)'
        }}>
          <Title style={{ fontSize: '24px' }}>Connect to an instance</Title>

          <Table dataSource={convertInstances(sessionList)} columns={[
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name'
            },
            {
              title: 'URL',
              dataIndex: 'url',
              key: 'url'
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

export default Instances;
