import React from 'react'
import { render } from 'react-dom'

import Entry from './Entry';

const mainElement = document.createElement('div')
mainElement.setAttribute('id', 'root')
document.body.appendChild(mainElement)

render(<Entry />, mainElement)
