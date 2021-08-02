/** @jsx jsx */
import React, { useRef, useState } from 'react';
import styled from '@emotion/styled';
import { jsx } from '@emotion/react';
import { Divider } from 'antd';

const StyledNavigationElement = styled.div`
    font-size: 36px;
    cursor: pointer;
    :hover {
        color: red;
    }
`;

const StyledNavigationSubMenu = styled.div`
    position: absolute;
    top: 80px;
    background-color: #24292E;
    border-radius: 15px;
    padding: 20px 30px;
`;

const NavigationSubMenuHeading = styled.h2`
    color: white;
`;

const NavigationSubMenuContent = styled.li`
    list-style: none;
`;

const StyledDivider = styled(Divider)`
    border-top: 1px solid white;
`;

type NavigationElementProps = {
    title: string,
}

type NavigationSubMenuProps = {
    show: boolean,
    onMouseOver: () => void,
    onMouseLeave: () => void,
}

const NavigationSubMenu: React.FC<NavigationSubMenuProps> = ({ show }) => {
  return show ? (
    <StyledNavigationSubMenu>
      <NavigationSubMenuHeading>Workspaces</NavigationSubMenuHeading>
      <StyledDivider />
      <NavigationSubMenuContent>
        <li>Workspace 1</li>
        <li>Workspace 2</li>
        <li>Workspace 3</li>
      </NavigationSubMenuContent>
    </StyledNavigationSubMenu>
  )
    : <React.Fragment> </React.Fragment>;
};

export const NavigationElement: React.FC<NavigationElementProps> = ({ title }) => {
  const [isHover, setHover] = useState(false);

  return (
    <React.Fragment>
      <StyledNavigationElement onMouseOver={() => setHover(true)}>{title}</StyledNavigationElement>
      <NavigationSubMenu onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)} show={isHover}>Navigation menu goes here</NavigationSubMenu>
    </React.Fragment>
  );
};
