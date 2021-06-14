import React from 'react';
import { Layout as AntdLayout, LayoutProps as AntdLayoutProps  } from 'antd';

const { Content } = AntdLayout;

export type LayoutProps = {
  children: React.ReactChild,
} & AntdLayoutProps;

const Layout: React.FC<LayoutProps> = (props) => {
  return <AntdLayout {...props} />;
};

export { Layout, Content } ;
