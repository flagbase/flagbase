import React from 'react';
import styled from '@emotion/styled';
import logo from '../../assets/flagbase-logo.png';

const SidebarContainer = styled.div`
  border-bottom: '1px solid #E8E8E8';
  background-color: #24292E;
  width: 110px;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
`;

const FlagbaseLogo = styled.img`
    width: 65px;
    height: auto;
`;

export type SidebarProps = {
  children: React.ReactChild,
  level: '1' | '2' | '3' | '4' | '5' | '6'
};

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  return <SidebarContainer>
    <FlagbaseLogo src={logo} />
    {children}
  </SidebarContainer>;
};

export default Sidebar;
