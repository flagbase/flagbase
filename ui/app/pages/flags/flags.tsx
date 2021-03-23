import React from 'react';

import AppNavigation from '../../../components/app-navigation';
import PageLayout from '../../../components/page-layout';

const Flags: React.FC = () => {
  return (
    <PageLayout
      navigation={
        <AppNavigation
          title="Flags"
          hasBackIcon
        />
      }
    >
      Todo: List of flags
    </PageLayout>
  );
};

export default Flags;
