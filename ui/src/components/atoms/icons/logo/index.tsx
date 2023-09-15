import React from 'react';

import { Link } from 'react-router-dom';

import FlagbaseLogo from './logo-black.png';

export const Logo = () => {
  return (
    <Link to="/">
      <img width={35} src={FlagbaseLogo as string} />
    </Link>
  );
};
