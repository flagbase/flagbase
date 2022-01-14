import React from 'react';
import styled from "@emotion/styled";
import { Button as AntdButton, ButtonProps as AntdButtonProps } from 'antd';

export type ButtonProps = {
  children: React.ReactChild
} & AntdButtonProps;

const StyledButton = styled(AntdButton)`
  display: inline-block;
  width: fit-content;
  margin-bottom: 15px;
`;


const Button: React.FC<ButtonProps> = (props) => {
  return <StyledButton {...props} />;
};

export default Button;
