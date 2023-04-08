import React from 'react';

export type TextProps = {
  children: React.ReactChild;
};

const Text: React.FC<TextProps> = (props) => {
  return <span {...props} />;
};

export default Text;
