import styled from '@emotion/styled';
import { PageHeader } from 'antd';

export const PageHeaderStyled = styled(PageHeader)`
  padding: 5px 10px;
  background-color: #fff;
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.08);
  border-radius: 5px;
  .ant-page-header-heading-title {
      color: black;
  }
`;

export const SubMenuContainer = styled.div`
display: flex;
align-items: center;
`;