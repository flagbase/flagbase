import { Button, Col, Input, Row, Typography, Form } from 'antd'
import React from 'react'
import { Instance } from '../../context/instance'
import { Entity } from '../../lib/entity-store/entity-store'

const { Title, Text } = Typography

type EditInstanceProps = {
    instance: Entity<Instance>
    addEntity: (entity: Entity<Instance>) => void
    removeEntity: (entityId: string) => void
}
const EditInstance: React.FC<EditInstanceProps> = ({ instance, addEntity, removeEntity }) => {
    const updateInstance = (update: any) => {
        addEntity({ ...instance, ...update })
    }
    const [form] = Form.useForm()

    return (
        <Row>
            <Col span={24}>
                <Title level={5}>Edit {instance.key}</Title>
            </Col>
            <Form
                layout="vertical"
                initialValues={instance}
                form={form}
                onValuesChange={updateInstance}
            >
                <Form.Item label="Key" name="key">
                    <Input placeholder={instance.key}></Input>
                </Form.Item>
                <Form.Item label="Connection String" name="connectionString">
                    <Input placeholder={instance.connectionString}></Input>
                </Form.Item>
                    <Button danger onClick={() => removeEntity(instance.id)}>Remove</Button>
            </Form>
        </Row>
    )
}

export default EditInstance
