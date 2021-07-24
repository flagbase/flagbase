import React from 'react';
import Sidebar from '../../components/sidebar';

export type WelcomeProps = {
  children: React.ReactChild,
  level: '1' | '2' | '3' | '4' | '5' | '6'
};

const Welcome: React.FC<WelcomeProps> = (props) => {
  return <span {...props} />;
};

export default Welcome;
