import React from 'react';
import styled from '@emotion/styled';
import logo from '../../assets/flagbase-logo.png';

const SidebarContainer = styled.div`
  border-bottom: 1px solid #E8E8E8;
  width: 110px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
`;

const NavigationItems = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    div {
        margin-bottom: 50px;
    }
`;

const FlagbaseLogo = styled.img`
    width: 65px;
    height: auto;
    margin-bottom: 50px;
`;

export type SidebarProps = {
  children: React.ReactNode,
  backgroundColor: string,
};

const Sidebar: React.FC<SidebarProps> = ({ children, backgroundColor }) => {
  return <SidebarContainer style={{ backgroundColor: backgroundColor }} >
    <FlagbaseLogo src={logo} />
    <NavigationItems>
      {children}
    </NavigationItems>

  </SidebarContainer>;
};

export default Sidebar;
