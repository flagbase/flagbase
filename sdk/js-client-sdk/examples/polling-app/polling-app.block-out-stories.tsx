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
  clientKey: 'sdk-client_eb64a3a3-8157-41dc-922a-a7fc8e05b377',
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
