---
sidebar_position: 2
---

# Use Cases

A single feature flag can be used for a variety of use cases. Below we'll go through some of the common use cases used by agile teams to deliver changes to their customers quickly.

<div align="center">
  <img width="570px" aria-label="Flagbase Economy" src="/assets/docs/intro/flagbase-economy.svg" />
</div>

## Continuous deployment

Feature flags enables developers to decouple deployments from releasing features. Developers can hide unfinished features behind a feature flag and enable it once it is finished. This means that users won't see the unfinished feature while it is still in development.

## System migration
It's risky to make structural changes to your system, whether it's moving to a new database or modernising systems. Feature management systems are used by operations teams to maintain stability during these procedures. Essentially, the idea is to put the application into maintenance mode and make essential system changes with the use of feature flags.

## Kill switch

Imagine discovering a particular feature in your system has been affected by security vulnerability. A developer would have to patch and release the new code to your users. However, whilst the patch is being written and deployed, there's a chance that users are still being affected as the feature is still active. If that feature had been wrapped with a feature flag, it could have been turned off remotely. And only turned back on once the patch has been released.

## Experimentation

Experiment or A/B tests are one of the most popular uses for feature flags. You can target a subset of users to see the new variation of your feature and compare relevant metrics to see how your new variation performs, comparing it to the previous variation.
