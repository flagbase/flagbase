import React from 'react';
import { Button, PageHeaderProps } from 'antd';
import { PageHeaderStyled } from './app-navigation.styles';

export interface ButtonProps {
    title: string;
    type: string;
}

export type AppNavigationProps = {
  hasBackIcon?: boolean;
  buttons?: Record<string, ButtonProps>;
} & PageHeaderProps;

const DynamicTitle: React.FC<AppNavigationProps> = () => {
  return (
    <h1>Boop boop lettuce</h1>
  );
};

const AppNavigation: React.FC<AppNavigationProps> = ({
  hasBackIcon,
  buttons,
  ...props
}) => {
  const renderedButtons = buttons.map((button: ButtonProps, index: number) => <Button key={`${button}_${index}`} type={button.type}>{button.title}</Button>);
  return (
    <PageHeaderStyled
      {...(hasBackIcon && { onBack: () => window.history.back() })}
      ghost={false}
      {...props}
      extra={renderedButtons}
    />
  );
};

export default AppNavigation;
