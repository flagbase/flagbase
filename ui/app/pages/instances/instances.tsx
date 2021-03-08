import React from 'react';

import AppNavigation from '../../../components/app-navigation';
import PageLayout from '../../../components/page-layout';

const Instances: React.FC = () => {
  return (
    <PageLayout
      navigation={
        <AppNavigation
          title="Instances"
          hasBackIcon
        />
      }
    >
      Todo: List of instances
    </PageLayout>
  );
};

export default Instances;
