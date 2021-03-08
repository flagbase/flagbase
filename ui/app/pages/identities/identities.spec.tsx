import React from 'react';
import { render } from '@testing-library/react';

import Identities from './identities';

test('Identities List should render', () => {
  const page = render(<Identities />);
  expect(
    page
  ).toMatchSnapshot();
});
