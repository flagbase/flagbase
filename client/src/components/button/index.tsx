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
  `inline-flex items-center justify-center rounded-md px-4 py-3 text-sm font-medium shadow-sm transition-colors duration-200 ease-in-out disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500`,
  {
    variants: {
      intent: {
        primary: `border border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`,
        secondary: `bg-white py-2 font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50`,
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
      className={buttonStyles({
        intent: variant,
        className,
      })}
      disabled={!isValid}
      {...props}
    >
      {prefix &&
        !loading &&
        createElement(prefix, {
          className: 'mr-3 h-5 w-5',
        })}
      {loading ? <Loader size="extraSmall" /> : props.children}
      {suffix &&
        !loading &&
        createElement(suffix, {
          className: 'ml-3 -mr-1 h-5 w-5',
        })}
    </button>
  );
}

export default Button;
