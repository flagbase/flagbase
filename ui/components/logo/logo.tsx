import styled from '@emotion/styled';
import React from 'react';
import FlagbaseLogo from './logo.png';

const StyledLogo = styled.img`
    margin: 0px 20px;
`;
const Logo: React.FC = () => {
  return (
    <StyledLogo width={35} src={FlagbaseLogo} />
  );
};

export default Logo;
