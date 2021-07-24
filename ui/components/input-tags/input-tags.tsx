import React from 'react';
import { Select as AntdSelect, SelectProps as AntdSelectProps } from 'antd';

const { Option } = AntdSelect;

export type InputTagProps = {
  children: React.ReactChild,
} & AntdSelectProps<string>;

const InputTags: React.FC<InputTagProps> = ({ children, placeholder }) => {
  return <AntdSelect mode="tags" placeholder={placeholder} style={{ width: '100%' }}>
    {children}
  </AntdSelect>;
};

export default InputTags;
