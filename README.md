![Flagbase.com](./www/content/assets/readme/readme-banner-v2.svg)

<p align="center">
  <img alt="Status" src="https://img.shields.io/badge/status-alpha-inactive" />
  <img alt="GitHub" src="https://img.shields.io/github/license/flagbase/flagbase" />
  <img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" />
  <img alt="Build" src="https://img.shields.io/github/actions/workflow/status/flagbase/flagbase/release-flagbase-core.yml?branch=master" />
  <img alt="Commits" src="https://img.shields.io/github/commit-activity/m/flagbase/flagbase/master" />
</p>

# **[Flagbase](https://flagbase.com)**: Democratizing Feature Management

[Flagbase](https://flagbase.com) is an open-source feature management platform, allowing you to manage, track and deliver feature flags to all your applications, in real-time. Flagbase was built with performance in mind, whilst being simple to use.

Flagbase offers these three key features:

- Workspace / Projects / Environments
- Feature Flags / Advanced Targeting
- Segments for reusable targeting
- Custom IAM roles and policies

Integrating Flagbase in your application is super simple. Get started by following our **[Quick Start Guide](https://flagbase.com/docs/guides/quick-start)** today!

## Features

Whilst Flagbase is quite minimal at its core - its extendable nature allows you to tailor it your organisation's needs.

Below are some of the features Flagbase offers:

### Intuitive Targeting

Flagbase employs a percentage-based targeting system as its default approach, enabling you to gradually deploy your features to specific user segments over a period of time. This incremental release strategy allows for seamless integration and adaptation of new functionalities, ensuring a tailored experience for each user group within your audience.
![Targeting demo](./www/content/assets/readme/targeting-demo.gif)

### Client and Server SDKs

Flagbase offers client-side and server-side SDKs for feature flagging. Client-side SDKs, embedded in client applications, personalize features for end-users but may have slower performance. Server-side SDKs handle server-to-server communication, maintain security, and are designed for high traffic and scalability.

|                                   Client SDK                                   |                                   Server SDK                                   |
| :----------------------------------------------------------------------------: | :----------------------------------------------------------------------------: |
| ![](./www/content/assets/blog/introducing-flagbase/client-side-evaluation.png) | ![](./www/content/assets/blog/introducing-flagbase/server-side-evaluation.png) |

### Well-designed Resource Hierarchy

Flagbase's resource hierarchy consists of instances, access, workspaces, projects, environments, flags, identities, segments, and targeting. An instance is a single Flagbase core installation using a shared PostgreSQL database. Access refers to key/secret pairs restricting operations on resources. Workspaces group projects, while projects contain flags and segments across multiple environments. Environments represent different targeting states. Flags determine feature states, while identities are flag observer/consumers. Segments group users based on traits, and targeting rules map conditions to flag variations within specific environments.

<p align="center">
  <img alt="Resource Hierarchy" src="./www/content/assets/readme/resource-hierarchy.png" />
</p>

### Other Features

- Supports various transports (HTTP long-polling, SSE)
- Features strong IAM with hybrid RBAC/ABAC policy-based access control
- Allows integration of custom data sources for flag evaluations
- Offers flexible self-hosting options: cloud or on-premises deployment

## Getting started

Flagbase is very easy to get up and running. Follow our [quick start guide](https://flagbase.com/docs/guides/quick-start) to get up an running:

1. [Set up the core](https://flagbase.com/docs/core/setup): provision the service on server(s). You can use your preferred cloud vendor.
2. [Integrate to your application](https://flagbase.com/docs/sdk/overview): use the SDK in your application to wrap features you want to control remotely.
3. [Configure targeting](https://flagbase.com/docs/guides/targeting): set up your flag's targeting rules so users see feature variations intended for them.

That's it! Now your ready to release your feature code - knowing that you'll be able to turn it off anytime 🚀

## Directories

This [monorepo](https://en.wikipedia.org/wiki/Monorepo) contains the code for Flagbase Core, UI & SDKs.

- **[`/core`](./core/README.md)**: Code for `flagbased`, the service used to manage protected resources and stream feature flags to the SDKs. This service can be run in multiple worker modes, including `poller`, `streamer` and `API`.
- **[`/sdk`](./sdk/README.md)**: SDKs retrieve and evaluate feature flags from the service.
- **[`/ui`](./ui/README.md)**: UI interacts with the [Core API](https://flagbase.com/docs/api). It is used to manage resources (e.g. workspaces, projects, environments, flags, etc).

## Support

Please [raise an issue](https://github.com/flagbase/flagbase/issues) and label it with `help wanted` or `question` for any help.

## Contributing

We encourage community contributions via pull requests. Before opening up a PR, please read our [contributor guidelines](https://flagbase.com/dev/intro/workflow#contributing).

Join us on [Github Discussions](https://github.com/flagbase/flagbase/discussions).

- [Announcements](https://github.com/flagbase/flagbase/discussions/categories/announcements): General PSAs & feature updates
- [Development](https://github.com/flagbase/flagbase/discussions/categories/dev): Where contributors discuss ideas
- [Help](https://github.com/flagbase/flagbase/discussions/categories/help): Stuck on something? Ask for help here 😄

## Other Resources

- [Roadmap](https://github.com/orgs/flagbase/projects/3/views/1)
- [Tasks Board](https://github.com/orgs/flagbase/projects/3/views/1)
- [Architecture](https://flagbase.com/dev/core/architecture)
- [Data models](https://flagbase.com/dev/core/data-models)

## License

Mozilla Public License Version 2.0, see [LICENSE](./LICENSE)
