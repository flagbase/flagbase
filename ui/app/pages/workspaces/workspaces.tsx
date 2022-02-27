import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Alert, notification, Typography } from 'antd';

import { Layout, Content } from "../../../components/layout";
import Table from "../../../components/table/table";
import { Instance, InstanceContext } from "../../context/instance";
import { Workspace, WorkspaceContext } from "../../context/workspace";
import { fetchWorkspaces } from "./api";
import { CreateWorkspace } from "./modal";
import Button from "../../../components/button";
import { Entities, Entity } from "../../lib/entity-store/entity-store";
import { Workspace as APIWorkspace } from './api';

const { Title, Text } = Typography;

const mergeExisting = (obj1, obj2) => {
    const mutableObject1 = Object.assign({}, obj1);
    const mutableObject2 = Object.assign({}, obj2);
  
    mergeFunction(mutableObject1, mutableObject2);
  
    return mutableObject1;
  };
  
  const mergeFunction = (obj1, obj2) => {
    Object.keys(obj2).forEach(function (key) {
      if (key in obj1) {
        if (typeof obj1[key] === 'object') {
          mergeFunction(obj1[key], obj2[key]);
        } else {
          obj1[key] = obj2[key];
        }
      }
    });
  };

export const convertWorkspaces = (workspaceList: Entities<Workspace>, instance: Instance, addEntity?: (entity: Entity<Workspace>) => void) => {
    console.log('test', workspaceList, instance)
    if (!workspaceList) {
        return []
    }


    return Object.values(workspaceList).map((workspace: Entity<Workspace>, index: number) => {
        const updateWorkspace = (update) => {
            if (addEntity) {
                const mergedEntity = mergeExisting(workspace, update)
                console.log('merged', mergedEntity)
                addEntity(mergedEntity)
            }
        }
        return {
            id: index,
            title: <Text editable={{ onChange: (value) => updateWorkspace({ attributes: { name: value}}) }}>{workspace.attributes.name}</Text>,
            href: `/projects/${instance?.id}/${workspace?.id}`,
            name: <Text editable={{ onChange: (value) => updateWorkspace({ attributes: { name: value}}) }}>{workspace.attributes.name}</Text>,
            description: <Text editable={{ onChange: (value) => updateWorkspace({ attributes: { description: value}}) }}>{workspace.attributes.description}</Text>,
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
    if (!instanceKey) {
        return <Alert message="Could not load this instance" type="error" />
    }
    
    const [visible, setVisible] = useState(false);
    const { getEntity, setSelectedEntityId } = useContext(InstanceContext);
    const { entities: workspaces, addEntity, addEntities, setStatus, status } = useContext(
        WorkspaceContext
    );

    const instance = getEntity(instanceKey);
    if (!instance) {
        return <Alert message="Could not load this instance" type="error" />
    }

    useEffect(() => {
        setStatus('loading')
        setSelectedEntityId(instanceKey)
        fetchWorkspaces(instance.connectionString, instance.accessToken).then(
            (result: APIWorkspace[]) => {
                console.log("RESULT", result)
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
        <React.Fragment>
            <CreateWorkspace visible={visible} setVisible={setVisible} />
            <Button onClick={() => setVisible(true)} type="primary" icon={<PlusCircleOutlined />}>
                    Create a workspace
          </Button>
          <Layout>
            <Content>
                    <Title level={3}>Join a workspace</Title>
                    <Table
                        loading={status !== 'loaded'}
                        dataSource={convertWorkspaces(
                            workspaces,
                            instance,
                            addEntity
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
        </Layout>
        </React.Fragment>

    );
};

export default Workspaces;
