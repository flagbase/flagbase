import React from 'react';
import { render } from 'react-dom';

import Router from './router';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'root');
document.body.appendChild(mainElement);

render(<Router />, document.getElementById('root'));
