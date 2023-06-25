import React, { createElement, useContext } from 'react';

import { cva } from 'class-variance-authority';
import { FormikContext } from 'formik';

import { Loader } from '../loader';

export type ButtonProps = {
  children: React.ReactChild;
  className?: string;
  suffix?: React.ElementType;
  prefix?: React.ElementType;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const buttonStyles = cva(
  [
    'py-3',
    'py-3 py-4',
    'flex',
    'justify-center',
    'transition-colors',
    'duration-200',
    'ease-in-out',
    'disabled:bg-gray-200',
    'disabled:text-gray-500',
    'disabled:cursor-not-allowed',
  ],
  {
    variants: {
      intent: {
        primary: [
          'inline-flex',
          'items-center',
          'rounded-md',
          'border',
          'border-transparent',
          'bg-indigo-600',
          'px-4',
          'text-sm',
          'font-medium',
          'text-white',
          'shadow-sm',
          'hover:bg-indigo-700',
          'focus:outline-none',
          'focus:ring-2',
          'focus:ring-indigo-500',
          'focus:ring-offset-2',
        ],
        secondary: [
          'inline-flex',
          'items-center',
          'rounded-md',
          'bg-white',
          'px-3',
          'py-2',
          'text-sm',
          'font-semibold',
          'text-gray-900',
          'shadow-sm',
          'ring-1',
          'ring-inset',
          'ring-gray-300',
          'hover:bg-gray-50',
        ],
      },
    },
    defaultVariants: {
      intent: 'primary',
    },
  },
);

export function Button({
  className = '',
  prefix,
  suffix,
  isLoading = false,
  variant = 'primary',
  ...props
}: ButtonProps) {
  let isValid = true;
  let isSubmitting = false;

  const formikContext = useContext(FormikContext);
  if (formikContext) {
    const { isValid: formikIsValid, isSubmitting: formikIsSubmitting } =
      formikContext;
    isValid = formikIsValid;
    isSubmitting = formikIsSubmitting;
  }

  const loading = isLoading || isSubmitting;

  return (
    <button
      type="button"
      className={buttonStyles({ intent: variant, className })}
      disabled={!isValid}
      {...props}
    >
      {prefix &&
        !loading &&
        createElement(prefix, { className: 'mr-3 h-5 w-5' })}
      {loading ? <Loader size="extraSmall" /> : props.children}
      {suffix &&
        !loading &&
        createElement(suffix, { className: 'ml-3 -mr-1 h-5 w-5' })}
    </button>
  );
}

export default Button;
