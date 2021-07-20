import React from 'react';
import { Select as AntdSelect, SelectProps as AntdSelectProps } from 'antd';

const { Option } = AntdSelect;

export type InputTagProps = {
  children: React.ReactChild,
} & AntdSelectProps<string>;

const InputTags: React.FC<InputTagProps> = ({ children }) => {
  return  <AntdSelect mode="tags" placeholder="Tags Mode">
  {children}
</AntdSelect>;
};

export default InputTags;
