import React from 'react';

import AppNavigation from '../../../components/app-navigation';
import PageLayout from '../../../components/page-layout';

const Segments: React.FC = () => {
  return (
    <PageLayout
      navigation={
        <AppNavigation
          title="Segments"
          hasBackIcon
        />
      }
    >
      Todo: List of segments
    </PageLayout>
  );
};

export default Segments;
