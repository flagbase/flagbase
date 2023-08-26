import React from 'react';

import { MapPinIcon } from '@heroicons/react/20/solid';

export function ListItem({
  id,
  title,
  location,
  status,
  tags,
  description,
}: {
  id: string;
  title: string;
  location: string;
  status: string;
  tags?: string;
  description?: string;
}) {
  return (
    <li className="overflow-hidden bg-white shadow sm:rounded-md" key={id}>
      <div className="p-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex-col sm:flex">
            <p className="truncate text-sm font-medium text-indigo-600">
              {title}
            </p>
            <p className="flex items-center text-sm text-gray-500">
              {description}
            </p>
          </div>
          <div className="ml-2 flex shrink-0">
            {status && (
              <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                {status}
              </p>
            )}
            <div className="ml-2 flex shrink-0">{tags}</div>
          </div>
        </div>
        <div className="mt-2 sm:flex sm:justify-between">
          <div className="sm:flex">
            {location && (
              <p className="flex items-center text-sm text-gray-500">
                <MapPinIcon
                  className="mr-1.5 h-5 w-5 shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                {location}
              </p>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
