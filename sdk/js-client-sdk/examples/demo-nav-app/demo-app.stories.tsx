import React from "react";
import { Story, Meta } from "@storybook/react";

import DemoApp, { DemoAppProps } from "./demo-app";
import NewNavigation from "./new-navigation";
import OldNavigation from "./old-navigation";

export default {
  title: "Example/DemoApp",
  component: DemoApp,
} as Meta;

const Template: Story<DemoAppProps> = (args) => <DemoApp {...args} />;

export const DefaultDemoApp = Template.bind({});
DefaultDemoApp.args = {
  clientKey: 'sdk-client_eb64a3a3-8157-41dc-922a-a7fc8e05b377',
  identity: {
    identifier: "cool-user",
    traits: {
      "some-trait-key": "blue",
    },
  },
  opts: {
    pollingServiceUrl: "https://poller.core.flagbase.xyz",
    pollingIntervalMs: 5000,
  }
};

export const NewNavigationBar = NewNavigation;

export const OldNavigationBar = OldNavigation;
