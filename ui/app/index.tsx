import React from 'react'
import { render } from 'react-dom'
import { debugContextDevtool } from 'react-context-devtool'
import 'antd/dist/antd.less'

import Router from './router'
import Context from './context'

const mainElement = document.createElement('div')
mainElement.setAttribute('id', 'root')
document.body.appendChild(mainElement)
const container = document.getElementById('root')

render(
    <Context>
        <Router />
    </Context>,
    container
)

debugContextDevtool(container, {
    disable: process.env.NODE_ENV !== 'development',
})
