import React from 'react';

const Layout: React.FC = ({ children }) => {
  return (
    <div className="py-5 px-12 rounded-md bg-white shadow-lg">{children}</div>
  );
};

export { Layout };
