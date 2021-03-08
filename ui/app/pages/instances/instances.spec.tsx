import React from 'react';
import { render } from '@testing-library/react';

import Instances from './instances';

test('Instance List should render', () => {
  const page = render(<Instances />);
  expect(
    page
  ).toMatchSnapshot();
});
