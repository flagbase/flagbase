/** @jsx jsx */

import React from 'react';
import { Button, PageHeaderProps } from 'antd';
import { PageHeaderStyled } from './app-navigation.styles';
import { BaseButtonProps } from 'antd/lib/button/button';
import { NavigationElement } from './navigation-element';
import { jsx } from '@emotion/react';

export interface ButtonProps {
    title: string;
    type: string;
}

const buttonColor = {
  link: '#24292e',
  ghost: '#24292e',
  text: '#24292e',
  default: '#24292e',
  dashed: '#24292e',
  primary: '#24292e'
};

export type AppNavigationProps = {
  title: string,
  hasBackIcon?: boolean;
  buttons: Array<Record<keyof ButtonProps, string>>;
} & PageHeaderProps;

const AppNavigation: React.FC<AppNavigationProps> = ({
  hasBackIcon,
  buttons,
  ...props
}) => {
  const renderedButtons = buttons.map((button: ButtonProps, index: number) => <Button css={{ backgroundColor: buttonColor[button.type as BaseButtonProps['type'] || 'default'] }} key={`${button}_${index}`} type={button.type as BaseButtonProps['type']}>{button.title}</Button>);
  return (
    <PageHeaderStyled
      {...(hasBackIcon && { onBack: () => window.history.back() })}
      ghost={false}
      {...props}
      extra={renderedButtons}
      title={<NavigationElement title={props.title} />}
    />
  );
};

export default AppNavigation;
