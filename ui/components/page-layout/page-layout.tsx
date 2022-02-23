import React from 'react';

import { PageContainer } from './page-layout.styles';
import Tabs from '../app-navigation/tabs';

type Props = {
  navigation: React.ReactNode;
};

const PageLayout: React.FC<Props> = ({ children, navigation }) => {
  return (
    <>
      {navigation}
      {/* <Tabs /> */}
      <PageContainer>
        {children}
      </PageContainer>
    </>
  );
};

export default PageLayout;
