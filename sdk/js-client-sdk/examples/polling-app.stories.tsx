import React from "react";
import { Story, Meta } from "@storybook/react";

import PollingApp, { PollingAppProps } from "./polling-app";

export default {
  title: "Example/PollingApp",
  component: PollingApp,
} as Meta;

const Template: Story<PollingAppProps> = (args) => <PollingApp {...args} />;

export const DefaultPollingApp = Template.bind({});
DefaultPollingApp.args = {
  clientKey: 'sdk-server_5121db29-a7c9-4dde-ba52-4b6fed4247b2',
  identity: {
    identifier: "cool-user",
    traits: {
      "some-trait-key": "aaaa",
    },
  },
  opts: {
    pollingServiceUrl: "https://poller.core.flagbase.xyz",
    pollingIntervalMs: 5000,
  }
};
