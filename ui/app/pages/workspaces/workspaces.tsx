import React from 'react';

import AppNavigation from '../../../components/app-navigation';
import PageLayout from '../../../components/page-layout';

const Workspaces: React.FC = () => {
  return (
    <PageLayout
      navigation={
        <AppNavigation
          title="Workspaces"
          hasBackIcon
        />
      }
    >
      Todo: List of workspaces
    </PageLayout>
  );
};

export default Workspaces;
