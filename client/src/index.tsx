import React from 'react';

// import FlagbaseProvider from '@flagbase/react-client-sdk';
import { NotificationProvider } from '@flagbase/ui';
import { debugContextDevtool } from 'react-context-devtool';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from 'react-query';
import { RouterProvider } from 'react-router-dom';

import queryClient from './router/query-client';
import newRouter from './router/router';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'root');
document.body.appendChild(mainElement);
const container = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

root.render(
  // <FlagbaseProvider
  //   clientKey="sdk-client_025729af-b5a4-435c-9144-d14ba816d174" // TODO: add prod key to prod env
  //   identity={{ identifier: 'USER_ID', traits: { age: 25 } }}
  //   opts={{ pollingIntervalMs: 5000 }} // TODO: add prod key to prod env
  // >
  <QueryClientProvider client={queryClient}>
    <NotificationProvider>
      <RouterProvider router={newRouter} />
    </NotificationProvider>
  </QueryClientProvider>,
  // </FlagbaseProvider>,
);

debugContextDevtool(container, {
  disable: process.env.NODE_ENV !== 'development',
});
