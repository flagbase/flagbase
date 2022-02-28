import { Alert, Dropdown, Menu, notification, Typography } from 'antd';
import { PlusCircleOutlined } from "@ant-design/icons";

import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Project, ProjectContext } from '../../context/project';
import Table from '../../../components/table/table';
import { fetchProjects } from './api';
import { Instance, InstanceContext } from '../../context/instance';
import { Entities, Entity } from '../../lib/entity-store/entity-store';
import { Layout, Content } from "../../../components/layout";
import Button from '../../../components/button';
import { CreateProject } from './projects.modal';
import { mergeExisting } from '../../helpers/mergeObject';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

export const convertProjects = (workspaceList: Entities<Project>, instance: Instance, addEntity?: (entity: Entity<Project>) => void, removeEntity?: (entityId: string) => void) => {
    if (!workspaceList) {
        return []
    }

    return Object.values(workspaceList).map((project: Entity<Project>, index: number) => {
        const updateProject = (update) => {
            if (addEntity) {
                const mergedEntity = mergeExisting(project, update)
                addEntity(mergedEntity)
            }
        }

        const menu = <Menu>
            {removeEntity && <Menu.Item onClick={() => removeEntity(project.id)} key="1">Remove</Menu.Item>}
        </Menu>
        return {
            id: index,
            title: project.attributes.name,
            href: `/flags/${instance?.id}/${project?.id}`,
            name: <Text editable={{ onChange: (value) => updateProject({ attributes: { name: value } }) }}>{project.attributes.name}</Text>,
            description: <Text editable={{ onChange: (value) => updateProject({ attributes: { description: value } }) }}>{project.attributes.description}</Text>,
            tags: project.attributes.tags.join(', '),
            action: (
                <>
                    <Dropdown overlay={menu}>
                        <Link to={`/flags/${instance?.id}/${project?.id}`}>Connect</Link>
                    </Dropdown>

                </>
            ),
        };
    });
};

const Projects: React.FC = () => {
    const { workspaceKey, instanceKey } = useParams<{ workspaceKey: string, instanceKey: string }>();
    if (!workspaceKey || !instanceKey) {
        return <Alert message="Could not load this instance" type="error" />
    }

    const [visible, setVisible] = useState(false);
    const { getEntity, setSelectedEntityId } = useContext(InstanceContext);
    const { entities: projects, addEntity, addEntities, setStatus, status, clearEntities, removeEntity } = useContext(
        ProjectContext
    );

    const instance = getEntity(instanceKey);
    if (!instance) {
        return <Alert message="Could not load this instance" type="error" />
    }

    useEffect(() => {
        setStatus('loading')
        setSelectedEntityId(instanceKey)
        clearEntities();
        fetchProjects(instance.connectionString, workspaceKey, instance.accessToken).then(
            (result) => {
                if (result.length == 0) {
                    return;
                }
                const projectList = result.reduce((previous, workspace) => {
                    return {
                        ...previous,
                        [workspace.id]: workspace
                    }
                }, {})
                addEntities(projectList);
            }
        ).catch(() => {
            notification.error({
                message: 'Could not load projects. Please try again.'
            })
        }).finally(() => {
            setStatus('loaded');
        })
    }, [workspaceKey]);

    return (
        <React.Fragment>
            <CreateProject visible={visible} setVisible={setVisible} />

            <Button onClick={() => setVisible(true)} type="primary" icon={<PlusCircleOutlined />}>
                Create a project
          </Button>
            <Layout>
                <Content>
                    <Title level={3}>Join a project</Title>
                    <Table
                        loading={status !== 'loaded'}
                        dataSource={convertProjects(
                            projects,
                            instance,
                            addEntity,
                            removeEntity
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

export default Projects;
