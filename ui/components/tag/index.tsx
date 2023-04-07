import React from 'react';
import { classNames } from '../../helpers';

const colors = {
  gray: 'bg-gray-100 text-gray-800',
  red: 'bg-red-100 text-red-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  green: 'bg-green-100 text-green-800',
  blue: 'bg-blue-100 text-blue-800',
  indigo: 'bg-indigo-100 text-indigo-800',
  purple: 'bg-purple-100 text-purple-800',
  pink: 'bg-pink-100 text-pink-800',
};

export default function Tag({
  children,
  className = '',
  color = 'blue',
  onDelete,
}: {
  children: React.ReactNode;
  className?: string;
  color?: keyof typeof colors;
  onDelete?: (tag: string) => void;
}) {
  return (
    <span
      className={classNames(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium',
        colors[color],
        className,
      )}
    >
      {children}
      {!!onDelete && (
        <button
          type="button"
          className="ml-1.5 flex-shrink-0 flex text-gray-400 hover:text-gray-500"
          onClick={() => onDelete(children.toString())}
        >
          <svg
            className="h-2 w-2"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 8 8"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M1 1l6 6M1 7l6-6"
            />
          </svg>
        </button>
      )}
    </span>
  );
}
