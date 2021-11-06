---
id: overview
title: Overview
sidebar_label: Overview
---

:::caution CURRENTLY IN DEVELOPMENT
Flagbase is **NOT** production ready yet. You can check out and subscribe to the project on [Github](https://github.com/flagbase/flagbase) for updates.
:::


[Flagbase](https://flagbase.com) is a open-source feature management platform. In essence, Flagbase allows you to manage, audit and transport feature flags efficiently to your applications.

<div align="center">
  <img width="570px" aria-label="Architecture Diagram" src="/assets/img/readme-banner.svg" />
</div>

Once you release your code behind a feature flag, you can control how it is being rolled out to customers. This allows you to run experiments via A/B tests and if something goes wrong, you can roll back remotely, without having to re-deploy.

## Quick Start
It's super easy to get Flagbase integrated with your application. Before jumping in and getting the system set up, we recommend you learn about the [key concepts](/docs/guides/overview).

1. [Get the core up and running](/docs/core/setup). This step is a one time step. If you've already set up and provisioned the core, move onto the next step.
1. [Install the SDK](/docs/sdk/overview) in your application. Once you've instantiated the SDK in your application, Flagbase will now be able to get your project's flagset.
1. [Create and configure your feature flag](/docs/guides/flag) in Flagbase.
1. Use your feature flag in code. Define what feature implementations users should see based on the variation they have been assigned.
1. Release your code! Don't worry, if your feature breaks you can just switch it off.
