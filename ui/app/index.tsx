import React from 'react';
import { render } from 'react-dom';
import { debugContextDevtool } from 'react-context-devtool';
import 'antd/dist/antd.css';

import Router from './router';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'root');
document.body.appendChild(mainElement);
const container = document.getElementById('root');

render(<Router />, container);

debugContextDevtool(container, {
  disable: process.env.NODE_ENV !== 'development'
});
