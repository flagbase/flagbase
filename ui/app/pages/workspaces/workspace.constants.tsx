export const constants = {
    create: 'Create a workspace',
    join: 'Join a workspace',
    error: 'Could not load workspaces. Please try again.',
}

export const workspaceColumns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Tags',
        dataIndex: 'tags',
        key: 'tags',
    },
    {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
    },
]
