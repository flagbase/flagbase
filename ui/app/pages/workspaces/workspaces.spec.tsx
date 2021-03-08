import React from 'react';
import { render } from '@testing-library/react';

import Workspaces from './workspaces';

test('Workspace List should render', () => {
  const page = render(<Workspaces />);
  expect(
    page
  ).toMatchSnapshot();
});
