import React from 'react';
import { render } from '@testing-library/react';

import Flags from './segments';

test('Flag List should render', () => {
  const page = render(<Flags />);
  expect(
    page
  ).toMatchSnapshot();
});
