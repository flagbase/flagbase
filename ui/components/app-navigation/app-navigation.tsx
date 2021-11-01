/** @jsx jsx */

import React, { useState } from 'react';
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
  subMenuContent: Array<Record<keyof FlagbaseSubMenuProps, string>>;
};

const AppSubMenu: React.FC<SubMenuProps> = ({ subMenuContent }) => {
  console.log('CONTENT', subMenuContent);
  const titles = Object.keys(subMenuContent);
  console.log('title', titles);
  const [currHover, setHover] = useState(null);
  return (
    <SubMenuContainer>
      {titles.map((title: string, index) => (
        <React.Fragment key={`${title}_${index}`}>
          <NavigationElement
            title={title}
            key={title}
            subMenuContent={subMenuContent[title].content}
            isHover={title === currHover}
            onHover={(title) => setHover(title)}
          />
          {index !== titles.length - 1 && <span></span>}
        </React.Fragment>
      ))}
    </SubMenuContainer>
  );
};

const AppNavigation: React.FC<AppNavigationProps> = ({
  hasBackIcon,
  buttons,
  subMenuContent,
  ...props
}) => {
  const renderedButtons = buttons?.map((button: ButtonProps, index: number) => (
    <Button
      css={{
        backgroundColor:
          buttonColor[(button.type as BaseButtonProps['type']) || 'default']
      }}
      key={`${button}_${index}`}
      type={button.type as BaseButtonProps['type']}
    >
      {button.title}
    </Button>
  ));
  return (
    <PageHeaderStyled
      {...(hasBackIcon && { onBack: () => window.history.back() })}
      ghost={false}
      {...props}
      extra={renderedButtons}
      title={<AppSubMenu subMenuContent={subMenuContent} />}
    />
  );
};

export default AppNavigation;
