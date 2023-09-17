import React, { createElement } from 'react';

import { InputProps } from './input.types';
import { classNames } from '../../../../helpers';

const InputIcon = ({ icon }: { icon: React.ElementType }) => {
  const inputClasses = classNames(
    'pointer-events-none absolute inset-y-0 right-4 flex items-center',
  );

  return (
    <div data-testid="prefix" className={inputClasses}>
      {createElement(icon, { className: 'h-5 w-5 text-gray-500' })}
    </div>
  );
};

const Input = ({
  className = '',
  icon,
  label,
  id,
  autoComplete = 'off',
  ...props
}: InputProps) => {
  const inputClasses = classNames(
    'block w-full rounded-md border-gray-300 h-14 pb-0 focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 peer text-xl',
    className,
  );

  const labelClasses = classNames(
    'absolute',
    'left-3 top-3',
    'peer-focus:top-1 peer-focus:text-xs',
    'pointer-events-none',
    'text-gray-700 transition-all',
    'peer-disabled:top-1 peer-disabled:text-xs',
    props.value ? 'top-1 text-xs' : 'top-3',
  );

  return (
    <>
      <div className="relative rounded-md shadow-sm">
        {icon && <InputIcon icon={icon} />}
        <input
          type="text"
          className={inputClasses}
          autoComplete={autoComplete}
          id={id}
          {...props}
        />
        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
      </div>
    </>
  );
};

export default Input;
