import React from 'react';
import { Input as AntdInput, InputProps as AntdInputProps } from 'antd';

export type InputProps = {
  children: React.ReactChild
} & AntdInputProps;

const Input: React.FC<InputProps> = (props) => {
  return <AntdInput {...props} />;
};

export default Input;
