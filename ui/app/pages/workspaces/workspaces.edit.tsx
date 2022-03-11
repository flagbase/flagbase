import { Button, Col, Row, Typography } from 'antd'
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
    const updateInstance = (key: string, value: string) => {
        addEntity({ ...instance, [key]: value })
    }
    return (
        <Row>
            <Col span={24}>
                <Title editable={{ onChange: (value) => updateInstance('key', value) }} level={3}>
                    {instance.key}
                </Title>
            </Col>
            <Col span={24}>
                <Text editable={{ onChange: (value) => updateInstance('connectionString', value) }}>
                    {instance.connectionString}
                </Text>
            </Col>
            <Col span={24}>
                <Button onClick={() => removeEntity(instance.id)}>Delete</Button>
            </Col>
        </Row>
    )
}

export default EditInstance
