import React, { createElement } from 'react';
import { classNames } from '../../helpers';
import { Loader } from '../loader';

export type ButtonProps = {
  children: React.ReactChild;
  className?: string;
  suffix?: React.ElementType;
  prefix?: React.ElementType;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({
  className = '',
  prefix,
  suffix,
  isLoading = false,
  variant = 'primary',
  ...props
}) => {
  return (
    <button
      type="button"
      className={classNames(
        'py-3 flex justify-center transition-colors duration-200 ease-in-out',
        isLoading
          ? 'inline-flex items-center rounded-md bg-white px-3 py-2 text-sm text-black font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-white'
          : '',
        variant === 'primary'
          ? 'inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          : '',
        variant === 'secondary'
          ? 'inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
          : '',
        'disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    >
      {prefix &&
        !isLoading &&
        createElement(prefix, { className: 'mr-3 h-5 w-5' })}
      {isLoading ? <Loader size="extraSmall" /> : props.children}
      {suffix &&
        !isLoading &&
        createElement(suffix, { className: 'ml-3 -mr-1 h-5 w-5' })}
    </button>
  );
};

export default Button;
