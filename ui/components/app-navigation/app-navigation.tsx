import React from 'react';
import { PageHeaderProps } from 'antd';

import { PageHeaderStyled } from './app-navigation.styles';

export type AppNavigationProps = {
  hasBackIcon?: boolean;
} & PageHeaderProps;

const AppNavigation: React.FC<AppNavigationProps> = ({
  hasBackIcon,
  ...props
}) => {
  return (
    <PageHeaderStyled
      {...(hasBackIcon && { onBack: () => window.history.back() })}
      ghost={false}
      {...props}
    />
  );
};

export default AppNavigation;
