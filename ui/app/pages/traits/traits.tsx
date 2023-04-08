import React from 'react';

import AppNavigation from '../../../components/app-navigation';
import PageLayout from '../../../components/page-layout';

const Traits: React.FC = () => {
  return (
    <PageLayout navigation={<AppNavigation title="Traits" hasBackIcon />}>
      Todo: List of traits
    </PageLayout>
  );
};

export default Traits;
