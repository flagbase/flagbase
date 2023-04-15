import React from 'react';

export type TextProps = {
  children: React.ReactChild;
  className?: string;
};

export const Text: React.FC<TextProps> = (props) => {
  return <span {...props} />;
};
