import React from 'react';

import { MapPinIcon } from '@heroicons/react/20/solid';

export type StackedEntityListProps = {
  entities: {
    id: string;
    title: string;
    location: string;
    status: string;
    tags?: string;
    description?: string;
  }[];
};

export function StackedEntityList({ entities }: StackedEntityListProps) {
  console.log('entity list', entities);

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {entities.map((entity) => (
          <li key={entity.id}>
            <div className="p-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-col sm:flex">
                  <p className="truncate text-sm font-medium text-indigo-600">
                    {entity.title}
                  </p>
                  <p className="flex items-center text-sm text-gray-500">
                    {entity.description}
                  </p>
                </div>
                <div className="ml-2 flex shrink-0">
                  {entity.status && (
                    <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                      {entity.status}
                    </p>
                  )}
                  <div className="ml-2 flex shrink-0">{entity.tags}</div>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  {entity.location && (
                    <p className="flex items-center text-sm text-gray-500">
                      <MapPinIcon
                        className="mr-1.5 h-5 w-5 shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      {entity.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
