import { FieldConfig } from 'formik';

export type InputProps = {
  icon?: React.ElementType;
  label?: string;
  autocomplete?: string;
} & FieldConfig &
  React.InputHTMLAttributes<HTMLInputElement>;
