import React from 'react';

import { Button } from '@flagbase/ui';
import { useRouteError } from 'react-router-dom';

type ErrorType = {
  message: string;
  status: number;
};

export const Error = () => {
  const { message, status } = (useRouteError() as ErrorType) || {
    message: 'Page not found',
    status: 404,
  };

  return (
    <div className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600">{status}</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {message}
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button goBack className="py-2">
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
};
