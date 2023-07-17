import React, { createElement, useEffect } from 'react';

import { FieldConfig, useFormikContext } from 'formik';

import { classNames } from '../../../../helpers';

export type InputProps = {
  icon?: React.ElementType;
  label?: string;
  autocomplete?: string;
} & FieldConfig &
  React.InputHTMLAttributes<HTMLInputElement>;

const InputIcon = ({ icon }: { icon: React.ElementType }) => {
  return (
    <div
      data-testid="prefix"
      className="pointer-events-none absolute inset-y-0 right-4 flex items-center"
    >
      {createElement(icon, { className: 'h-5 w-5 text-gray-500' })}
    </div>
  );
};

export const Input = ({
  className = '',
  icon,
  label,
  autoComplete = 'off',
  ...props
}: InputProps) => {
  const inputClasses = classNames(
    'block w-full rounded-md border-gray-300 h-14 pb-0 focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 peer text-xl',
    className,
  );

  const labelClasses = classNames(
    'absolute peer-focus:top-1 peer-focus:text-xs  pointer-events-none text-gray-700 transition-all left-3 top-1 peer-disabled:top-1 peer-disabled:text-xs',
  );

  return (
    <div className="relative rounded-md shadow-sm">
      {icon && <InputIcon icon={icon} />}
      <input
        type="text"
        className={inputClasses}
        {...props}
        placeholder={undefined}
        autoComplete={autoComplete}
      />
      <label htmlFor={props.id || props.name} className={labelClasses}>
        {label}
      </label>
    </div>
  );
};

export const KeyInput = (props: InputProps) => {
  const {
    setFieldValue,
    values: { name },
  } = useFormikContext<{ name: string }>();
  useEffect(() => {
    if (name && name.trim() !== '') {
      setFieldValue('key', name.split(' ').join('-').toLowerCase());
    }
  }, [name, setFieldValue]);

  return <Input {...props} />;
};

type RawInputProps = {
  icon?: React.ElementType;
  className?: string;
  label?: string;
  value: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const RawInput: React.FC<RawInputProps> = ({
  icon,
  label,
  className,
  value,
  ...props
}) => {
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
            `block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 h-14 pb-0`,
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200',
            className ? className : '',
            'peer text-xl',
          )}
          {...props}
        />
        <label
          htmlFor={label}
          className={classNames(
            `left-4 absolute peer-focus:top-0 peer-focus:text-sm  pointer-events-none text-gray-500 transition-all`,
            !value ? 'top-4' : '',
            value ? 'top-0 text-xs' : '',
            'peer-disabled:top-0 peer-disabled:text-sm',
          )}
        >
          {label}
        </label>
      </div>
    </div>
  );
};
