/* eslint-disable no-return-assign */
/** @jsx jsx */

import React, { useRef, useState } from 'react';
import { Button, PageHeaderProps, SubMenuProps } from 'antd';
import { PageHeaderStyled } from './app-navigation.styles';
import { BaseButtonProps } from 'antd/lib/button/button';
import { NavigationElement } from './navigation-element';
import { jsx } from '@emotion/react';
import styled from '@emotion/styled';

const SubMenuContainer = styled.div`
  display: flex;
  align-items: center;
`;
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

type FlagbaseSubMenuProps = 'instance' | 'workspace' | 'project' | 'flags';

export type AppNavigationProps = {
  title: string;
  hasBackIcon?: boolean;
  buttons: Array<Record<keyof ButtonProps, string>>;
  subMenuContent: Array<Record<keyof FlagbaseSubMenuProps, string>>;
} & PageHeaderProps;

type SubMenuProps = {
  subMenuContent: Record<keyof FlagbaseSubMenuProps, string>;
};

const AppSubMenu: React.FC<SubMenuProps> = ({ subMenuContent }) => {
  const [currHover, setHover] = useState<string>('');
  return (
    <SubMenuContainer>
      {Object.keys(subMenuContent).map((title: string, index) => (
        <NavigationElement
          title={title}
          key={`${title}_${index}`}
          subMenuContent={subMenuContent[title].content}
          isHover={title === currHover}
          onHover={(title: string) => setHover(title)}
        />
      ))}
    </SubMenuContainer>
  );
};

const AppNavigation: React.FC<AppNavigationProps> = ({
  hasBackIcon,
  subMenuContent,
  ...props
}) => {
  return (
    <PageHeaderStyled
      {...(hasBackIcon && { onBack: () => window.history.back() })}
      ghost={false}
      {...props}
      title={<AppSubMenu subMenuContent={subMenuContent} />}
    />
  );
};

export default AppNavigation;
