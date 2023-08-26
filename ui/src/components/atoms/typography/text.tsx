import React from 'react';

export type TextProps = {
  children: React.ReactChild;
  className?: string;
};

export const Text = (props: TextProps) => {
  return <span {...props} />;
};
