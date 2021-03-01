import React from 'react'
import { Button as AntdButton, ButtonProps as AntdButtonProps  } from 'antd'

export type ButtonProps = {
  children: React.ReactChild
} & AntdButtonProps;

const Button: React.FC<ButtonProps> = (props) => {
  return <AntdButton {...props} />
}

export default Button
