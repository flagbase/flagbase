import { ReactElement } from 'react';

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
};

export type SubMenuProps = {
  subMenuContent: Partial<Record<keyof FlagbaseSubMenuProps, string>>;
};
