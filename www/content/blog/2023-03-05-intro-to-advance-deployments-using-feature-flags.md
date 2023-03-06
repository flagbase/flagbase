---
slug: intro-to-advance-deployments-using-feature-flags
title: Intro to Advanced Deployments using Feature Flags
authors: cjoy
tags: [howto, practices]
---

In traditional software development, new features and updates are released to all users simultaneously. This approach has some limitations, such as the risk of introducing bugs and errors that can negatively affect users' experiences. Additionally, it can be challenging to test and optimize new features before releasing them to everyone.

Feature flags provide a solution to these problems by allowing developers to release new features to specific groups of users or enable them on a gradual basis. This approach enables developers to test and optimize features before releasing them to everyone, reducing the risk of introducing bugs and ensuring a smoother rollout.

<!--truncate-->

## Traditional Deployment Strategies

Deployments are a crucial part of software development. They involve moving code from one environment to another, such as from a staging environment to production. Some traditional deployment strategies were the product of branching patterns. One such pattern is Git flow.


### Git Flow

Git flow is a popular branching strategy that helps developers manage their code and deployments. In Git flow, feature branches are merged into the develop branch. The develop branch contains the latest feature changes and is deployed to the staging environment for testing.

![Git Flow](/assets/blog/intro-to-advance-deployments-using-feature-flags/git-flow.png)

Hotfix branches are used to address bugs and help bypass the develop branch. This allows developers to quickly fix issues without having to wait for the next release cycle.

The release branch contains the most stable version of the application and is what is released to users. This ensures that users always have access to a stable version of the application.

Git flow-based deployments solves the problem of deploying directly to production, which could introduce bugs and other issues. However, it has its own problems. Hotfixes take time to fix and merge into the release branch, then re-deploy. All users would be affected if the release branch has some bad code.

![Git Flow Problem](/assets/blog/intro-to-advance-deployments-using-feature-flags/git-flow-problem.png)


### Traffic Splitting Strategies

To address these issues, traffic splitting strategies became popular. These strategies involve directing traffic between different versions of an application in order to test out new features or fixes.

#### Blue/Green Deployment

In Blue/Green deployment, two separate but identical environments are created: Blue environment running the current application version and Green environment running the new application version.

![Blue/Green Deployment](/assets/blog/intro-to-advance-deployments-using-feature-flags/blue-green-deployments.png)

Traffic is directed between these two environments in order to test out new features or fixes before rolling them out to all users.

However, this strategy still has a problem: all users would be affected if there's some bad code in either environment. All new features that were released would have to be rolled back, even if it was just one feature causing the issue. 

![Blue/Green Deployment Problems](/assets/blog/intro-to-advance-deployments-using-feature-flags/blue-green-deployments-problems.png)

#### Canary Deployment

Canary deployment addresses this issue by deploying a new version of service gradually to new users. This allows developers to test out new features on a small subset of users before rolling them out to everyone.

![Canary Deployment](/assets/blog/intro-to-advance-deployments-using-feature-flags/canary-deployments.png)

Canary deployment has several advantages over other deployment strategies:
- It allows developers to test out new features on a small subset of users before rolling them out to everyone.
- It reduces risk by allowing developers to catch any issues early on before they affect all users.
- It allows for more controlled rollouts by gradually increasing or decreasing traffic based on user feedback or performance metrics.

However, it still has its own problem: it's not able to independently test out features on different cohorts because features are released together in batches.

![Canary Deployment Problems](/assets/blog/intro-to-advance-deployments-using-feature-flags/canary-deployments-problems.png)


## Introducing Feature Flags

Feature flags (also known as feature toggles or feature gates) are points in code that split traffic and control what variation of a feature users are exposed to. They're usually used in conditional statements like if statements.

![Introducing Feature Flags](/assets/blog/intro-to-advance-deployments-using-feature-flags/what-is-a-feature-flag.png)


![If statement containing feature flag](/assets/blog/intro-to-advance-deployments-using-feature-flags/if-statement.png)


### Basic Concepts

#### Local Feature Store

![Local Feature Store](/assets/blog/intro-to-advance-deployments-using-feature-flags/local-feature-store.png)


A local feature store is where feature flag values are stored on the user’s device. These values are often configurable by application users. Examples of local feature stores include `chrome://flags` and `firefox://about:config`.

![Local Feature Store Example](/assets/blog/intro-to-advance-deployments-using-feature-flags/local-feature-store-example.png)


The problem with local feature stores is that once the application is released to users, flags can no longer be configured by the developer - unless they release a new application with different feature flag values.

![Local Feature Store Problem](/assets/blog/intro-to-advance-deployments-using-feature-flags/local-feature-store-problem.png)


#### Remote Feature Store

A remote feature store allows flag values to be controlled remotely. This means that users can be targeted to see certain features or experiences.

![Remote Feature Store](/assets/blog/intro-to-advance-deployments-using-feature-flags/remote-feature-store.png)


However, it's important to note that feature flags should be temporary. Developers need to remove their feature flags once they’ve finished rolling out! Having a large amount of feature flags can cause application degradation (i.e. large flagset payload transmitted over the network into the application).

Feature flags solve the problem of releasing features independently as traffic splitting is controlled per feature. This means that features can now be released independently to a subset of users.

### Feature Management Platforms

There are several proprietary platforms available for managing your feature flags such as LaunchDarkly, ConfigCat, Split.io, StatsSig and Rollouts.io.

![Proprietary vendors](/assets/blog/intro-to-advance-deployments-using-feature-flags/proprietary-vendors.png)

And obviously there is Flagbase. Our platform is free to use and fully open source. The core was built with performance in mind. [Try it out in your application today!](https://flagbase.com/docs/intro/overview)

![Flagbase for the win](/assets/blog/intro-to-advance-deployments-using-feature-flags/flagbase.png)



## Conclusion

In conclusion, feature flags are a powerful tool for developers to control the release of new features and target specific users. Feature flags allow for the **decoupling of feature releases with deployments**. By using a feature management platform like Flagbase, developers can easily manage their feature flags and ensure that their application remains performant. Whether you're using a local or remote feature store, it's important to remember to remove your feature flags once they've served their purpose. Happy coding!
