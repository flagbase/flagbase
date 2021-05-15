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
  clientKey: 'sdk-client_4fbb5464-0a71-4fb0-9268-b426d6b710e5',
  identity: {
    identifier: "cool-user",
    traits: {
      "some-trait-key": "aaaa",
    },
  },
  opts: {
    pollingServiceUrl: "http://127.0.0.1:9051",
    pollingIntervalMs: 5000,
  }
};
