import React from 'react';
import { Layout as AntdLayout, LayoutProps as AntdLayoutProps } from 'antd';
import styled from '@emotion/styled';

const { Content } = AntdLayout;

const StyledModal = styled(AntdLayout)`
    padding: 0px 50px;
    background-color: #FFF;

    input:first-of-type {
        margin-top: 1em;
    }
    input {
        margin-bottom: 1em;
    }
`

const StyledLayout = styled(AntdLayout)`
    padding-top: 0px;
    background-color: #F9F9F9;

    main {
        padding: 20px 50px;
        background-color: white;
        box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
    }
`
export type LayoutProps = {
  children: React.ReactChild,
} & AntdLayoutProps;

const Layout: React.FC<LayoutProps> = (props) => {
  return <StyledLayout {...props} />;
};

const ModalLayout: React.FC<LayoutProps> = (props) => {
    return <StyledModal {...props} />;
  };
  

export { Layout, ModalLayout, Content };
