import React from 'react';

import AppNavigation from '../../../components/app-navigation';
import PageLayout from '../../../components/page-layout';

const Projects: React.FC = () => {
  return (
    <PageLayout
      navigation={
        <AppNavigation
          title="Projects"
          hasBackIcon
        />
      }
    >
      Todo: List of projects
    </PageLayout>
  );
};

export default Projects;
