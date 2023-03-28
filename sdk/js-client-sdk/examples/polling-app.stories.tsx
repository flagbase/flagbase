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
  clientKey: 'sdk-client_9722ab62-b9e5-45b0-8124-bdec6ce18bc3',
  identity: {
    identifier: "cool-user",
    traits: {
      "some-trait-key": "aaaa",
    },
  },
  opts: {
    pollingIntervalMs: 8000,
  }
};
