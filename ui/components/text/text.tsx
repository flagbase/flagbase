import React from 'react';

export type TextProps = {
  children: React.ReactChild,
  level: '1' | '2' | '3' | '4' | '5' | '6'
};

const Text: React.FC<TextProps> = (props) => {
  return <span  {...props} />;
};

export default Text;
