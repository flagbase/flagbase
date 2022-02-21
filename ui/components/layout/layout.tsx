import React from 'react';
import { Layout as AntdLayout, LayoutProps as AntdLayoutProps } from 'antd';

const { Content } = AntdLayout;

export type LayoutProps = {
  children: React.ReactChild,
} & AntdLayoutProps;

const Layout: React.FC<LayoutProps> = (props) => {
  return <AntdLayout {...props} />;
};

const ModalLayout: React.FC<LayoutProps> = (props) => {
    return <AntdLayout {...props} style={{ padding: "0px 50px", backgroundColor: "#FFF" }} />;
  };
  

export { Layout, ModalLayout, Content };
