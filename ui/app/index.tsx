import React from 'react'
import FlagbaseProvider from '@flagbase/react-client-sdk'
import { debugContextDevtool } from 'react-context-devtool'
import 'antd/dist/antd.less'
import { createRoot } from 'react-dom/client'

import { QueryClientProvider } from 'react-query'
import { RouterProvider } from 'react-router-dom'
import { newRouter, queryClient } from './router/router'

const mainElement = document.createElement('div')
mainElement.setAttribute('id', 'root')
document.body.appendChild(mainElement)
const container = document.getElementById('root')
const root = createRoot(container) // createRoot(container!) if you use TypeScript

root.render(
    <FlagbaseProvider
        clientKey="sdk-client_025729af-b5a4-435c-9144-d14ba816d174" // TODO: add prod key to prod env
        identity={{ identifier: 'USER_ID', traits: { age: 25 } }}
        opts={{ pollingIntervalMs: 5000 }}  // TODO: add prod key to prod env
    >
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={newRouter} />
        </QueryClientProvider>
    </FlagbaseProvider>
)

debugContextDevtool(container, {
    disable: process.env.NODE_ENV !== 'development',
})
