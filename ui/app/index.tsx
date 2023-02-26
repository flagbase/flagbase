import React from 'react'
import { render } from 'react-dom'
import { debugContextDevtool } from 'react-context-devtool'
import 'antd/dist/antd.less'

import Router from './router'
import Context from './context'
import { QueryClient, QueryClientProvider } from 'react-query'

const mainElement = document.createElement('div')
mainElement.setAttribute('id', 'root')
document.body.appendChild(mainElement)
const container = document.getElementById('root')

const queryClient = new QueryClient()

render(
    <Context>
        <QueryClientProvider client={queryClient}>
            <Router />
        </QueryClientProvider>
    </Context>,
    container
)

debugContextDevtool(container, {
    disable: process.env.NODE_ENV !== 'development',
})
