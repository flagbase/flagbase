import React, { createElement, ReactNode } from 'react';

import { classNames } from '@flagbase/ui';
import { ArrowLeftCircleIcon } from '@heroicons/react/24/outline';
import { Link, useLocation, useMatches } from 'react-router-dom';

function PageHeading({
  title,
  subtitle,
  tabs,
  backHref,
}: {
  title: string;
  subtitle: string | ReactNode;
  tabs?: { name: string; href: string }[];
  backHref?: string | undefined;
}) {
  const location = useLocation();
  const pathname = decodeURI(location.pathname);
  const matches = useMatches() as any;
  const { handle: { rightContainer } = { rightContainer: null } } =
    matches.find((match) => match?.handle) ?? {};

  return (
    <header
      className={`border-b border-gray-200 bg-gray-50 pt-8 ${
        !tabs || tabs.length === 0 ? 'pb-8' : ''
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:flex xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-row items-center gap-5">
          {backHref && (
            <Link to={backHref}>
              <ArrowLeftCircleIcon
                className="h-10 w-10 text-gray-400"
                aria-hidden="true"
              />
            </Link>
          )}
          <div className="flex flex-col">
            <h1 className="text-xl font-bold capitalize leading-7 text-gray-900 sm:text-2xl sm:tracking-tight">
              {title}
            </h1>
            <p className="mt-1 truncate text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
        {rightContainer && (
          <div className="mt-3 sm:mt-5">{createElement(rightContainer)}</div>
        )}
      </div>
      {tabs && tabs.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:flex xl:items-center xl:justify-between">
          {/* Mobile View */}
          <div className="py-4 sm:hidden">
            <label htmlFor="tabs" className="sr-only">
              Select a tab
            </label>
            {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
            <select
              id="tabs"
              name="tabs"
              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              {tabs.map((tab) => (
                <option key={tab.name}>{tab.name}</option>
              ))}
            </select>
          </div>
          {/* Desktop View */}
          <div className="hidden sm:block">
            <div>
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                  <Link
                    key={tab.name}
                    to={tab.href}
                    className={classNames(
                      tab.href === pathname
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                      'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium',
                    )}
                    aria-current={tab.href === pathname ? 'page' : undefined}
                  >
                    {tab.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default PageHeading;
