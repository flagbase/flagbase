/** @jsx jsx */
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { jsx } from '@emotion/react';
import { Divider } from 'antd';

const StyledNavigationElement = styled.div`
  font-size: 25px;
  cursor: pointer;
  padding: 10px 25px;
  border-radius: 15px;
  :hover {
    font-weight: bold;
    background-color: #2d3339;
  }
  z-index: 1000;
`;

const StyledNavigationSubMenu = styled.div`
  position: absolute;
  top: 80px;
  background-color: #24292e;
  border-radius: 15px;
  padding: 20px 30px;
`;

const StyledDivider = styled(Divider)`
  border-top: 1px solid white;
`;

type NavigationElementProps = {
  title: string;
  subMenuContent: Array<Record<string, string>>;
  isHover: boolean;
  onHover: () => void;
  offHover: () => void;
  onClick: () => void;

};

type NavigationSubMenuProps = {
  show: boolean;
  onMouseOver: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  subMenuContent: Array<Record<string, string>>;
  title: string;
};

const NavigationSubMenu: React.FC<NavigationSubMenuProps> = ({
  show,
  onMouseOver,
  onMouseLeave,
  subMenuContent,
  title
}) => {
  return show && subMenuContent.length > 0 ? (
    <StyledNavigationSubMenu
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
    >
      <h2 css={{ color: 'white' }}>{title}</h2>
      <StyledDivider />
      <li css={{
        listStyle: 'none',
        fontWeight: 'normal'
      }}>
        {subMenuContent?.map((content, index) => (
          <li key={`submenu_content_${index}_${content.title}`}>
            {content.title}
          </li>
        ))}
      </li>
    </StyledNavigationSubMenu>
  ) : (
    <React.Fragment> </React.Fragment>
  );
};

export const NavigationElement: React.FC<NavigationElementProps> = ({
  title,
  subMenuContent,
  onHover,
  offHover,
  onClick,
  isHover
}) => {
  return (
    <StyledNavigationElement onClick={onClick} onMouseOver={() => onHover(title)}>
      {title} 
      <NavigationSubMenu
        title={title}
        subMenuContent={subMenuContent}
        onMouseOver={() => onHover()}
        onMouseLeave={() => offHover()}
        show={isHover}
      />
    </StyledNavigationElement>
  );
};
