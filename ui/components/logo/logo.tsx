import React from 'react';

import { Link } from 'react-router-dom';

import FlagbaseLogo from './logo-black.png';

const Logo: React.FC = () => {
  return (
    <Link to="/">
      <img width={35} src={FlagbaseLogo as string} />
    </Link>
  );
};

export default Logo;
