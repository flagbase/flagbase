import React from 'react';
import styled from '@emotion/styled';

const SidebarElementContainer = styled.div`
  cursor: pointer;
`;

export type SidebarElementProps = {
  image: string,
};

const SidebarElement: React.FC<SidebarElementProps> = ({ image }) => {
  return <SidebarElementContainer>
    <img src={image} />
  </SidebarElementContainer>;
};

export default SidebarElement;
