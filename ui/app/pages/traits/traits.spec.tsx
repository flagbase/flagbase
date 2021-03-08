import React from 'react';
import { render } from '@testing-library/react';

import Traits from './traits';

test('Trait List should render', () => {
  const page = render(<Traits />);
  expect(
    page
  ).toMatchSnapshot();
});
