import React, { useContext, useState } from 'react';

import AppNavigation from '../../../components/app-navigation';
import Button from '../../../components/button';
import Input from '../../../components/input';
import { Content, Layout } from '../../../components/layout';
import PageLayout from '../../../components/page-layout';
import Table from '../../../components/table/table';
import { Typography } from 'antd';
import { Instance, InstanceContext } from '../../context/instance';
import { v4 as uuidv4 } from 'uuid';

const { Title, Text } = Typography;

const Instances: React.FC = () => {
  const [currInstance, setInstance] = useState({
    id: '',
    connectionString: '',
    key: '',
    accessToken: '',
    accessKey: ''
  } as Instance);

  const { addEntity, removeEntity, entities: instanceList, } = useContext(InstanceContext)

  const addInstance = (instance: Instance) => {
    addEntity({...instance, id: uuidv4()})
  };

  const deleteInstance = (deletedSession: Instance) => {
    removeEntity(deletedSession.id)
  }

  const convertInstances = (instanceList: Instance[]) => {
    console.log("INSTANCE LIST", instanceList)
    return instanceList.map((instance:Instance, index: number) => {
      return {
        id: '',
        connectionString: instance.connectionString,
        action: <>
          <a href={`/workspaces/${instance.key.toLowerCase()}`}>Connect</a>
          <span> | </span>
          <a onClick={() => deleteInstance(instance)}>Delete</a>
        </>,
        key: instance.key,
        accessKey: instance.accessKey,
        accessToken: instance.accessToken,
      } as Instance;
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
            key: event.target.value
          })} placeholder="Instance name" style={{ marginTop: '1em', marginBottom: '1em' }} />
          <Input onChange={(event) => setInstance({
            ...currInstance,
            connectionString: event.target.value
          })} placeholder="URL" style={{ marginBottom: '1em' }} />
          <Input onChange={(event) => setInstance({
            ...currInstance,
            accessKey: event.target.value
          })} placeholder="Access Key" style={{ marginBottom: '1em' }} />
          <Input onChange={(event) => setInstance({
            ...currInstance,
            accessToken: event.target.value
          })} placeholder="Access Token" style={{ marginBottom: '1em' }} />
          <Button onClick={() => addInstance(currInstance)} type="primary" style={{ marginBottom: '1em' }}>Submit</Button>
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

          <Table dataSource={convertInstances(Object.values(instanceList as unknown as {}))} columns={[
            {
              title: 'Name',
              dataIndex: 'key',
              key: 'key'
            },
            {
              title: 'URL',
              dataIndex: 'connectionString',
              key: 'connectionString'
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
