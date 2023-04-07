import * as Yup from 'yup';

export const constants = {
  create: 'Create Workspace',
  join: 'Workspaces',
  error: 'Could not load workspaces. Please try again.',
};

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
];

export const NewWorkspaceSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('This field is required'),
  description: Yup.string().optional(),
  tags: Yup.array().optional(),
});
