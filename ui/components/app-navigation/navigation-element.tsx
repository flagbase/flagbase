/** @jsx jsx */
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { jsx } from '@emotion/react';
import { Divider } from 'antd';

const StyledNavigationElement = styled.div`
    font-size: 24px;
    cursor: pointer;
    padding: 10px 25px;
    border-radius: 15px;
    :hover {
        font-weight: bold;
        background-color: #2D3339;

    }
`;

const StyledNavigationSubMenu = styled.div`
    position: absolute;
    top: 100px;
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
    subMenuContent: Array<Record<string, string>>,
}

type NavigationSubMenuProps = {
    show: boolean,
    onMouseOver: () => void,
    onMouseLeave: () => void,
    subMenuContent: Array<Record<string, string>>,
    title: string,
}

const NavigationSubMenu: React.FC<NavigationSubMenuProps> = ({ show, onMouseOver, onMouseLeave, subMenuContent, title }) => {
  return show ? (
    <StyledNavigationSubMenu onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
      <NavigationSubMenuHeading>{title}</NavigationSubMenuHeading>
      <StyledDivider />
      <NavigationSubMenuContent>
        {subMenuContent?.map((content, index) => <li key={`submenu_content_${index}_${content.title}`}>{content.title}</li>)}
      </NavigationSubMenuContent>
    </StyledNavigationSubMenu>
  )
    : <React.Fragment> </React.Fragment>;
};

export const NavigationElement: React.FC<NavigationElementProps> = ({ title, subMenuContent }) => {
  const [isHover, setHover] = useState(false);

  return (
    <React.Fragment>
      <StyledNavigationElement onMouseOver={() => setHover(true)}>{title}</StyledNavigationElement>
      <NavigationSubMenu title={title} subMenuContent={subMenuContent} onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)} show={isHover}>Navigation menu goes here</NavigationSubMenu>
    </React.Fragment>
  );
};
