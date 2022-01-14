/* eslint-disable no-return-assign */
/** @jsx jsx */

import React from 'react';
import { PageHeaderStyled } from './app-navigation.styles';
import { jsx } from '@emotion/react';

import { AppNavigationProps } from './app-navigation.types';
import Breadcrumbs from './breadcrumbs';
import Tabs from './tabs';

const AppNavigation: React.FC<AppNavigationProps> = ({
  hasBackIcon,
  ...props
}) => {
  return (
    <PageHeaderStyled
      ghost={false}
      {...props}
      breadcrumbRender={() => <Breadcrumbs />}
    />
  );
};

export default AppNavigation;
