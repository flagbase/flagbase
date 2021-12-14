/* eslint-disable no-return-assign */
/** @jsx jsx */

import React, { ReactElement, useContext, useState } from "react";
import { PageHeaderProps } from "antd";
import { PageHeaderStyled } from "./app-navigation.styles";
import { NavigationElement } from "./navigation-element";
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { HomeFilled, RightOutlined } from "@ant-design/icons";
import { Redirect, useHistory } from "react-router-dom";
import { InstanceContext } from "../../app/context/instance";
import { WorkspaceContext } from "../../app/context/workspace";
import { convertWorkspaces } from "../../app/pages/workspaces/workspaces";

const SubMenuContainer = styled.div`
  display: flex;
  align-items: center;
`;
export interface ButtonProps {
  title: string;
  type: string;
}

type FlagbaseSubMenuProps =
  | "Home"
  | "Instance"
  | "Workspace"
  | "Project"
  | "Flags"

type FlagbaseSubMenuValues = {
  title: ReactElement,
  redirect: string,
  content: { title: string; href: string; }[]
}
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
  subMenuContent: Partial<Record<keyof FlagbaseSubMenuProps, string>>;
};

const AppSubMenu: React.FC<SubMenuProps> = ({ subMenuContent }) => {
  const [currHover, setHover] = useState<string>("");
  const [redirect, setRedirect] = useState<string>('');
  if (redirect) {
    return (
      <Redirect to={redirect} />
    )
  }
  return (
    <SubMenuContainer>
      {Object.keys(subMenuContent).map((title: string, index) => (
        <NavigationElementContainer>
          <NavigationElement
            title={subMenuContent[title]?.title || title}
            key={`${title}_${index}`}
            subMenuContent={subMenuContent[title].content}
            isHover={title === currHover}
            onHover={() => setHover(title)}
            offHover={() => setHover("")}
            onClick={() => setRedirect(subMenuContent[title]?.redirect)}
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
  ...props
}) => {
  const { getEntity } = useContext(InstanceContext);
  const {
    entities: workspaces,
    addEntity,
    status: workspaceStatus,
  } = useContext(WorkspaceContext);
  
  const reduceSubMenuContent = (path: string) => {
    let subMenuContent: Partial<Record<FlagbaseSubMenuProps, FlagbaseSubMenuValues>> = {
      Home: {
        title: <HomeFilled />,
        redirect: '/',
        content: [
          {
            title: "test",
            href: "#",
          },
        ],
      },
    };

    if (workspaceStatus === "loaded") {
      console.log('workspaces', workspaces)
      subMenuContent["Workspace"] = {
        title: <React.Fragment>Workspaces</React.Fragment>,
        redirect: `/workspaces`,
        content: convertWorkspaces(Object.values((workspaces as unknown) as {})),
      };
    }
    return subMenuContent;
  };

  const history = useHistory();
  const subMenuContent = reduceSubMenuContent(history.location.pathname);

  return (
    <PageHeaderStyled
      ghost={false}
      {...props}
      title={<AppSubMenu subMenuContent={subMenuContent} />}
    />
  );
};

export default AppNavigation;
