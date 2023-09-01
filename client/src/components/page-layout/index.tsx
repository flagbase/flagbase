import React from 'react';

import { Outlet } from 'react-router-dom';

import Header from './header';
import { Footer } from '../footer';

function PageLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PageLayout;
