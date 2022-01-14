/* eslint-disable no-return-assign */
/** @jsx jsx */

import React from "react";

import { jsx } from "@emotion/react";
import { Tabs as AntdTabs } from "antd";

const { TabPane } = AntdTabs;

const Tabs: React.FC = ({}) => {
  function callback(key) {
    console.log(key);
  }

  return (
    <AntdTabs style={{backgroundColor: '#F5F5F5'}} defaultActiveKey="1" onChange={callback}>
      <TabPane  tab="Tab 1" key="1">
        Content of Tab Pane 1
      </TabPane>
      <TabPane tab="Tab 2" key="2">
        Content of Tab Pane 2
      </TabPane>
      <TabPane tab="Tab 3" key="3">
        Content of Tab Pane 3
      </TabPane>
    </AntdTabs>
  );
};

export default Tabs;
