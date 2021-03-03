import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Greetings from '../pages/greetings';

const Router: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/">
        <Greetings />
      </Route>
    </Switch>
  </BrowserRouter>
);

export default Router;
