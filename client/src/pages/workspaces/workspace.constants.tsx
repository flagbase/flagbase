import { createColumnHelper } from '@tanstack/react-table';
import * as Yup from 'yup';

export const constants = {
  create: 'Create Workspace',
  join: 'Workspaces',
  error: 'Could not load workspaces. Please try again.',
};

type Workspace = {
  id: number;
  title: JSX.Element;
  href: string;
  name: JSX.Element;
  action: JSX.Element;
  description: JSX.Element;
  tags: JSX.Element[];
  key: string;
};

const columnHelper = createColumnHelper<Workspace>();

const getCellValue = (cell: any) => cell.getValue();

export const workspaceColumns = [
  columnHelper.accessor('name', {
    header: () => 'Name',
    cell: getCellValue,
  }),
  columnHelper.accessor('description', {
    header: () => 'Description',
    cell: getCellValue,
  }),
  columnHelper.accessor('tags', {
    header: () => 'Tags',
    cell: getCellValue,
  }),
];

export const NewWorkspaceSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('This field is required'),
  description: Yup.string().optional(),
  tags: Yup.array().optional(),
});
