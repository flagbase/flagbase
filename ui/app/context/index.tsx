import React, { ReactNode } from 'react';

import { compose } from '../lib/compose';
import { InstanceProvider } from './instance';
import { WorkspaceProvider } from './workspace';

const ComposedProvider: React.ReactNode = ({ children }: { children: ReactNode }) => compose(
  WorkspaceProvider,
  InstanceProvider
)(children);

export default ComposedProvider;
