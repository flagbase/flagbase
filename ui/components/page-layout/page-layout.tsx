import React from 'react';
import ComposedProvider from '../../app/context';

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
