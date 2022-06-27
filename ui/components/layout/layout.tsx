import React from 'react'
import { Layout as AntdLayout, LayoutProps as AntdLayoutProps } from 'antd'
import styled from '@emotion/styled'

const { Content } = AntdLayout

const StyledModal = styled(AntdLayout)`
    padding: 0px 50px;
    background-color: #fff;

    input:first-of-type {
        margin-top: 1em;
    }
    input {
        margin-bottom: 1em;
    }
`

const StyledLayout = styled(AntdLayout)`
    padding-top: 0px;
    background-color: #f9f9f9;

    main {
        padding: 20px 50px;
        background-color: white;
        box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.08);
        border-radius: 5px;
    }
`
export type LayoutProps = {
    children: React.ReactChild
} & AntdLayoutProps

const Layout: React.FC<LayoutProps> = (props) => {
    return <StyledLayout {...props} />
}

const ModalLayout: React.FC<LayoutProps> = (props) => {
    return <StyledModal {...props} />
}

export { Layout, ModalLayout, Content }
