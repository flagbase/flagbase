import React from 'react';

import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function MobileDropdown({
  name,
  children,
}: {
  name: string;
  description: string;
  href: string;
  children: {
    name: string;
    description: string;
    href: string;
  }[];
}) {
  return (
    <Disclosure as="div" className="-mx-3">
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 hover:bg-gray-50">
            {name}
            <ChevronDownIcon
              className={classNames(
                open ? 'rotate-180' : '',
                'h-5 w-5 flex-none',
              )}
              aria-hidden="true"
            />
          </Disclosure.Button>
          <Disclosure.Panel className="mt-2 space-y-2">
            {children.map((item) => (
              <Disclosure.Button
                key={item.name}
                as={Link}
                to={item.href}
                className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
              >
                {item.name}
              </Disclosure.Button>
            ))}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export default MobileDropdown;
