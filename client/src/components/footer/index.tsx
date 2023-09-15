import React from 'react';

import { Logo } from '@flagbase/ui';
import { Link } from 'react-router-dom';

const navigation = {
  //Guides
  // SDK Docs
  // API Docs
  documentation: [
    {
      name: 'Quick Start',
      href: 'https://flagbase.com/docs/guides/quick-start',
    },
    { name: 'SDK Docs', href: 'https://flagbase.com/docs/sdk/overview' },
    { name: 'API Docs', href: 'https://flagbase.com/docs/core/api' },
  ],
  development: [
    { name: 'Overview', href: 'https://flagbase.com/dev/intro/overview' },
    {
      name: 'Management',
      href: 'https://flagbase.com/dev/intro/workflow#project-management',
    },
    {
      name: 'Contributing   ',
      href: 'https://flagbase.com/dev/intro/workflow#contributing',
    },
  ],
  organisation: [
    { name: 'About', href: 'https://flagbase.com/about' },
    { name: 'Blog', href: 'https://flagbase.com/blog' },
    { name: 'Community', href: 'https://flagbase.com/community' },
  ],
  opensource: [
    { name: 'Components', href: 'https://flagbase.com/oss' },
    { name: 'Source Code', href: 'https://github.com/flagbase/flagbase' },
    {
      name: 'Discussion',
      href: 'https://github.com/flagbase/flagbase/discussions',
    },
  ],
  social: [
    {
      name: 'GitHub',
      href: 'https://github.com/flagbase/flagbase',
    },
  ],
};

export function Footer() {
  return (
    <footer className="mt-20 bg-gray-50" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 py-8 sm:pt-8 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <div>
              <Link to="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Flagbase</span>
                {/* <img className="h-8 w-auto" src={Logo} alt="" /> */}
              </Link>
              <p className="text-sm leading-6 text-gray-600">
                Feature Management Simplified.
              </p>
              <p className="text-sm leading-6 text-gray-600">
                Community-Driven.
              </p>
            </div>
            {/* <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-gray-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
              <a
                href="https://github.com/flagbase/flagbase/issues/new"
                className="flex gap-2 text-gray-400 hover:text-gray-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="">Report an issue</span>
              </a>
            </div> */}
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Documentation
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.documentation.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Development
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.development.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Organisation
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.organisation.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Open Source
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.opensource.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-500">
            &copy; 2023 Flagbase. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
