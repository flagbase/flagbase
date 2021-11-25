/* eslint-disable no-return-assign */
/** @jsx jsx */

import React, { useState } from 'react';
import { PageHeaderProps, SubMenuProps } from 'antd';
import { PageHeaderStyled } from './app-navigation.styles';
import { NavigationElement } from './navigation-element';
import { jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { RightOutlined } from '@ant-design/icons';

const SubMenuContainer = styled.div`
  display: flex;
  align-items: center;
`;
export interface ButtonProps {
  title: string;
  type: string;
}


type FlagbaseSubMenuProps = 'instance' | 'workspace' | 'project' | 'flags';

const NavigationElementContainer = styled.div`
  display: flex;
  align-items: center;
`;
export type AppNavigationProps = {
  title: string;
  hasBackIcon?: boolean;
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
        <NavigationElementContainer>
          <NavigationElement
            title={title}
            key={`${title}_${index}`}
            subMenuContent={subMenuContent[title].content}
            isHover={title === currHover}
            onHover={(title: string) => setHover(title)}
          />
          {index !== Object.keys(subMenuContent).length - 1 && <RightOutlined /> }  
        </NavigationElementContainer>
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
      ghost={false}
      {...props}
      title={<AppSubMenu subMenuContent={subMenuContent} />}
    />
  );
};

export default AppNavigation;
