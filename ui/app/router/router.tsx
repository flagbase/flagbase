import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Context from '../context';
import Greetings from '../pages/greetings';

const Router: React.FC = () => (
  <Context>
    <BrowserRouter>
      <Switch>
        <Route path="/">
          <Greetings />
        </Route>
      </Switch>
    </BrowserRouter>
  </Context>
);

export default Router;
