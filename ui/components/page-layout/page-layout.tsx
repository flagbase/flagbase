import React from 'react';

import { PageContainer } from './page-layout.styles';

type Props = {
  navigation: React.ReactNode;
};

const PageLayout: React.FC<Props> = ({ children, navigation }) => {
  return (
    <>
      {navigation}
      <PageContainer>
        {children}
      </PageContainer>
    </>
  );
};

export default PageLayout;
