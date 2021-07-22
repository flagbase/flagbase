import React from 'react';
import styled from '@emotion/styled';

const SidebarElement = styled.div`
  
`;

export type SidebarElementProps = {
  image: string,
};

const Sidebar: React.FC<SidebarElementProps> = ({ image }) => {
  return <SidebarElement>
    <img src={image} />
  </SidebarElement>;
};

export default Sidebar;
