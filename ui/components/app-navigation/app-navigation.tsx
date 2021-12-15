/* eslint-disable no-return-assign */
/** @jsx jsx */

import React, { useContext, useState } from "react";
import { PageHeaderStyled, SubMenuContainer } from "./app-navigation.styles";
import { NavigationElement } from "./navigation-element";
import { jsx } from "@emotion/react";
import { HomeFilled, RightOutlined } from "@ant-design/icons";
import { Redirect } from "react-router-dom";
import { InstanceContext } from "../../app/context/instance";
import { WorkspaceContext } from "../../app/context/workspace";
import { convertWorkspaces } from "../../app/pages/workspaces/workspaces";
import { AppNavigationProps, FlagbaseSubMenuProps, FlagbaseSubMenuValues, SubMenuProps } from "./app-navigation.types";

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
        <React.Fragment>
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
        </React.Fragment>
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
  
  const reduceSubMenuContent = () => {
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

  const subMenuContent = reduceSubMenuContent();

  return (
    <PageHeaderStyled
      ghost={false}
      {...props}
      title={<AppSubMenu subMenuContent={subMenuContent} />}
    />
  );
};

export default AppNavigation;
