import React from 'react';

import { PageHeaderStyled } from './app-navigation.styles';
import { AppNavigationProps } from './app-navigation.types';

const AppNavigation: React.FC<AppNavigationProps> = ({ ...props }) => {
  return <PageHeaderStyled ghost={false} {...props} />;
};

export default AppNavigation;
