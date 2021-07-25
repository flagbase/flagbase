import React, { useState } from 'react';
import styled from '@emotion/styled';

const StyledNavigationElement = styled.div`
    font-size: 36px;
`;

const StyledNavigationMenu = styled.div`
    position: absolute;
    top: 80px;
    background-color: #24292E;
    border-radius: 15px;
    padding: 20px;
`;
type NavigationElementProps = {
    title: string,
}

export const NavigationElement: React.FC<NavigationElementProps> = ({ title }) => {
  const [isHover, setHover] = useState(false);

  return (
    <>
      <StyledNavigationElement onMouseOver={() => setHover(true)}>{title}</StyledNavigationElement>
      {isHover && <StyledNavigationMenu>Navigation menu goes here</StyledNavigationMenu>}
    </>
  );
};
