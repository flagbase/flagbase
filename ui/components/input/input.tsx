import React, { createElement, useEffect } from 'react';
import { FieldConfig, useField, useFormikContext } from 'formik';
import { classNames } from '../../helpers';
import { Instance } from '../../app/pages/instances/instances.functions';

export type InputProps = {
  icon?: React.ElementType;
  label?: string;
} & FieldConfig &
  React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = ({ icon, className, label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div>
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div
            data-testid="prefix"
            className="pointer-events-none absolute inset-y-0 right-4 flex items-center"
          >
            {createElement(icon, { className: 'h-5 w-5 text-gray-500' })}
          </div>
        )}
        <input
          type="text"
          className={classNames(
            `block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500  h-14`,
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200',
            meta.touched && meta.error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : '',
            className ? className : '',
            'peer text-xl',
          )}
          {...field}
          {...props}
          placeholder={undefined}
        />
        <label
          htmlFor={props.id || props.name}
          className={classNames(
            `absolute peer-focus:top-0 peer-focus:text-sm  pointer-events-none text-gray-700 transition-all`,
            !meta.value ? 'top-4' : '',
            meta.value ? 'top-0 text-sm' : '',
            icon ? 'left-11' : 'left-3',
            'peer-disabled:top-0 peer-disabled:text-sm',
          )}
        >
          {label}
        </label>
      </div>
      {meta.touched && meta.error ? (
        <div className="pr-3 flex items-center pointer-events-none text-red-500 text-sm mt-1">
          {meta.error}
        </div>
      ) : null}
    </div>
  );
};

export const KeyInput: React.FC<InputProps> = ({ ...props }) => {
  const [field, meta] = useField<string>(props);
  const {
    setFieldValue,
    values: { name },
  } = useFormikContext<Instance>();
  useEffect(() => {
    if (name && name.trim() !== '') {
      setFieldValue('key', name.split(' ').join('-').toLowerCase());
    }
  }, [name, meta.value, setFieldValue]);

  return <Input {...props} />;
};

type RawInputProps = {
  prefix?: any;
  label?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const RawInput: React.FC<RawInputProps> = ({
  prefix,
  label,
  ...props
}) => {
  const { placeholder } = props;

  return (
    <div className="relative rounded-md shadow-sm">
      {prefix && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {createElement(prefix, { className: 'h-5 w-5' })}
        </div>
      )}
      <input
        type="text"
        className={classNames(
          `block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`,
          prefix ? 'pl-10' : '',
        )}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};
export default Input;
