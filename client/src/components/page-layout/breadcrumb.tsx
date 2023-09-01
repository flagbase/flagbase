import React, { Fragment } from 'react';

import { Transition, Popover } from '@headlessui/react';
import {
  ArrowLeftCircleIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

function Breadcrumb({
  name,
  description,
  type,
  href,
  children,
  chevron = true,
}: {
  name: string;
  description: string;
  type: string;
  href: string;
  chevron?: boolean;
  children: {
    name: string;
    description: string;
    href: string;
  }[];
}) {
  return (
    <Popover className="relative">
      <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 ">
        <li key={name}>
          <div className="flex items-center">
            {chevron && (
              <ChevronRightIcon
                className="h-5 w-5 shrink-0 text-gray-400"
                aria-hidden="true"
              />
            )}
            <a
              href="#"
              className={`${
                chevron ? 'ml-4' : ''
              } text-sm font-medium text-gray-500 hover:text-gray-700`}
            >
              {name}
            </a>
          </div>
        </li>{' '}
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
          <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
            <Link to={href} className="mb-2 flex items-center gap-1">
              <ArrowLeftCircleIcon
                className="h-5 w-5 flex-none text-indigo-600 hover:text-indigo-800"
                aria-hidden="true"
              />
              <h3 className="text-base font-semibold leading-6 text-indigo-600 hover:text-indigo-800">
                {type}
              </h3>
            </Link>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
          <div className="p-4">
            {children.map((child) => (
              <div
                key={child.name}
                className="group relative flex gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
              >
                <div className="flex-auto">
                  <Link
                    to={child.href}
                    className="block font-semibold text-gray-900"
                  >
                    {child.name}
                    <span className="absolute inset-0" />
                  </Link>
                  <p className="mt-1 text-gray-600">{child.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

export default Breadcrumb;
