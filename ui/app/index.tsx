import React from 'react'
import { render } from 'react-dom'
import { debugContextDevtool } from 'react-context-devtool'
import 'antd/dist/antd.less'
import { createRoot } from 'react-dom/client'

import Router from './router'
import Context from './context'
import { QueryClient, QueryClientProvider } from 'react-query'
import { createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import { newRouter, queryClient } from './router/router'

const mainElement = document.createElement('div')
mainElement.setAttribute('id', 'root')
document.body.appendChild(mainElement)
const container = document.getElementById('root')
const root = createRoot(container) // createRoot(container!) if you use TypeScript

root.render(
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={newRouter} />
    </QueryClientProvider>,
    container
)

debugContextDevtool(container, {
    disable: process.env.NODE_ENV !== 'development',
})
