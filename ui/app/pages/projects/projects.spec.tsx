import React from 'react';
import { render } from '@testing-library/react';

import Projects from './projects';

test('Project List should render', () => {
  const page = render(<Projects />);
  expect(
    page
  ).toMatchSnapshot();
});
