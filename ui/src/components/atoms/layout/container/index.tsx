import React, { ReactNode } from 'react';

export const SettingsContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mx-auto max-w-lg px-4 pb-12 pt-10 lg:pb-16">{children}</div>
  );
};
