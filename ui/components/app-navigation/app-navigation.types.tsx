import { ReactElement } from 'react';

import { PageHeaderProps } from 'antd';

export interface ButtonProps {
  title: string;
  type: string;
}

export type FlagbaseSubMenuProps =
  | 'Home'
  | 'Instance'
  | 'Workspace'
  | 'Project'
  | 'Flags';

export type FlagbaseSubMenuValues = {
  title: ReactElement;
  redirect: string;
  content: { title: string; href: string }[];
};

export type AppNavigationProps = {
  title: string;
  hasBackIcon?: boolean;
} & PageHeaderProps;

export type SubMenuProps = {
  subMenuContent: Partial<Record<keyof FlagbaseSubMenuProps, string>>;
};
