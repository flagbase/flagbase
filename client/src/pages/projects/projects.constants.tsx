import { createColumnHelper } from '@tanstack/react-table';
import * as Yup from 'yup';

export const constants = {
  create: 'Create a project',
  join: 'Join a project',
  error: 'Could not load projects. Please try again.',
};

type Project = {
  description: string;
  key: string;
  name: string;
  tags: string[];
};

const columnHelper = createColumnHelper<Project>();

const getCellValue = (cell: any) => cell.getValue();

export const projectsColumn = [
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
export const NewProjectSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('This field is required'),
  description: Yup.string().optional(),
  tags: Yup.array().optional(),
});
