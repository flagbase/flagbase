import React from 'react';

export function compose (
  ...composable: React.FC[]
): (component: React.ReactNode) => React.ReactNode {
  return (component: React.ReactNode) =>
    composable.reduceRight((children, Composable) => {
      return Composable({ children });
    }, component);
}
