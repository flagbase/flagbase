import React, { useState } from 'react';

import { Transition } from '@headlessui/react';

const DropdownSkeletonLoader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="block w-full rounded-md bg-gray-300 py-2 pl-3 pr-10 text-left shadow-md focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
      >
        <span className="flex items-center">
          <span className="truncate">Dropdown Skeleton Loader</span>
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M6.293 6.707a1 1 0 0 0 0 1.414L9.586 11l-3.293 3.293a1 1 0 1 0 1.414 1.414l3.998-3.998a1 1 0 0 0 .002-1.416l-3.998-3.998a1 1 0 0 0-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>
      <Transition
        show={isOpen}
        enter="transition ease-out duration-100 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="absolute z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <div className="my-1 h-5 animate-pulse rounded bg-gray-300" />
            <div className="my-1 h-5 animate-pulse rounded bg-gray-300" />
            <div className="my-1 h-5 animate-pulse rounded bg-gray-300" />
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default DropdownSkeletonLoader;
