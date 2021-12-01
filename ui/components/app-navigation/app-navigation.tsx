/* eslint-disable no-return-assign */
/** @jsx jsx */

import React, { useState } from "react";
import { PageHeaderProps } from "antd";
import { PageHeaderStyled } from "./app-navigation.styles";
import { NavigationElement } from "./navigation-element";
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { HomeFilled, RightOutlined } from "@ant-design/icons";

const SubMenuContainer = styled.div`
  display: flex;
  align-items: center;
`;
export interface ButtonProps {
  title: string;
  type: string;
}

type FlagbaseSubMenuProps = "Home" | "Instance" | "Workspace" | "Project" | "Flags";

const NavigationElementContainer = styled.div`
  display: flex;
  align-items: center;
`;
export type AppNavigationProps = {
  title: string;
  hasBackIcon?: boolean;
  subMenuContent: Record<FlagbaseSubMenuProps, object>;
} & PageHeaderProps;

type SubMenuProps = {
  subMenuContent: Record<keyof FlagbaseSubMenuProps, string>;
};

const AppSubMenu: React.FC<SubMenuProps> = ({ subMenuContent }) => {
  const [currHover, setHover] = useState<string>("");
  return (
    <SubMenuContainer>
      {Object.keys(subMenuContent).map((title: string, index) => (
        <NavigationElementContainer>
          <NavigationElement
            title={subMenuContent[title].title || title}
            key={`${title}_${index}`}
            subMenuContent={subMenuContent[title].content}
            isHover={title === currHover}
            onHover={() => setHover(title)}
            offHover={() => setHover('')}
          />
          {index !== Object.keys(subMenuContent).length - 1 && (
            <RightOutlined />
          )}
        </NavigationElementContainer>
      ))}
    </SubMenuContainer>
  );
};

const AppNavigation: React.FC<AppNavigationProps> = ({
  hasBackIcon,
  subMenuContent,
  ...props
}) => {
  return (
    <PageHeaderStyled
      ghost={false}
      {...props}
      title={<AppSubMenu subMenuContent={subMenuContent} />}
    />
  );
};

export default AppNavigation;
