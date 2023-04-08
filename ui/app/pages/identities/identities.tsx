import React from 'react';

import AppNavigation from '../../../components/app-navigation';
import PageLayout from '../../../components/page-layout';

const Identities: React.FC = () => {
  return (
    <PageLayout navigation={<AppNavigation title="Identities" hasBackIcon />}>
      Todo: List of identities
    </PageLayout>
  );
};

export default Identities;
