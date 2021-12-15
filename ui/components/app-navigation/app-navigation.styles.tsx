import styled from '@emotion/styled';
import { PageHeader } from 'antd';

export const PageHeaderStyled = styled(PageHeader)`
  border-bottom: 1px solid #E8E8E8;
  background-color: #24292E;
  border-radius: 15px;
  padding: 5px 10px;
  .ant-page-header-heading-title {
      color: white;
  }
`;

export const SubMenuContainer = styled.div`
display: flex;
align-items: center;
`;