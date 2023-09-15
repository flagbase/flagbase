import React, { ReactNode } from 'react';

import { classNames } from '../../../helpers';

export const Heading = ({
  children,
  level = 3,
  className = '',
}: {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}) => {
  const headingStyles = [
    'text-4xl font-semibold leading-tight', // h1
    'text-3xl font-semibold leading-snug', // h2
    'text-2xl font-semibold leading-normal', // h3
    'text-xl font-semibold leading-normal', // h4
    'text-lg font-semibold leading-normal', // h5
    'text-base font-semibold leading-normal', // h6
  ];

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <HeadingTag
      className={classNames(
        headingStyles[level - 1],
        'text-gray-900',
        className,
      )}
    >
      {children}
    </HeadingTag>
  );
};

export const EditEntityHeading = ({
  heading,
  subheading,
}: {
  heading: string;
  subheading: string;
}) => {
  return (
    <div className="mb-4">
      <h1 className="text-lg font-medium leading-6 text-gray-900">{heading}</h1>
      <p className="mt-1 text-sm text-gray-500">{subheading}</p>
    </div>
  );
};
