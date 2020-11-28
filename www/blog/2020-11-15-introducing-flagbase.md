---
title: Introducing Flagbase
author: Chris Joy
authorURL: http://github.com/cjoy
authorImageURL: https://avatars2.githubusercontent.com/u/10393925?s=60&v=4
---

We are very happy to introduce [Flagbase](https://github.com/flagbase/flagbase), a open-source feature management service.

We created [Flagbase](https://flagbase.com), to provide an open feature management solution. We wanted to build a tool to help organisations build their own product change release workflow to satisfy their unique requirements (per user-experimentation etc).

:::caution
This project is still under development and is not at a usable state yet. Feel free to contribute to this open-source project on [Github](https://github.com/flagbase/flagbase).
:::

<!--truncate-->

## The Plan

Everything below is just a collation of my thought when initially starting Flagbase. I attempt to structure a journey for the dev team to go through during development. It's essentially an in-formal roadmap. This journey has been split into well-defined stages. These stages are not meant to be linear, but should run in parallel. However, the execution of some stages are dependent on the success of other stages.

### Vision

- Flagbase becomes the industry standard feature management solution. We define best-practices for feature flag delivery, targeting attributes management and feature evaluation. The Flagbase Protocol becomes synonymous with the “gold-standard” in how flagsets and rulesets should be serialised, transported and evaluated.
- Flagbase is not only know for being open-source, but is known for being the most efficient and flexible solution (flexibility as in developers are able to adapt Flagbase core to their own needs - i.e. change management and experimentation require slightly different solutions from a technical standpoint - Flagbase aims to bring the divide between these different use-case).
- Flagbase provides advanced auditing capabilities by leveraging resource temporality via Postgres triggers. All time-series queries are highly optimised since we’re relying on Hypertables (PG with TimescaleDB extension). All resource mutations are automatically tracked. We have data-layer fail safes which prevent unauthorised mutations (preventing service-level resource misuse - in case service-layer Casbin Enforcer fails).
- Flagbase adopts a minimal resource access management layer that is mimicked by competitors, getting rid off permanent pre-generated SDK keys (currently used by competitors - LaunchDarkly, Split, ConfigCat, Optimizely, Rollout.io etc). Temporary user-generated access tokens become the standard which unifies resource authorisation across different our transports.

### Stage 0 - OSS Initialisation

In this stage, we focus on all-things open source. This includes our open source software and the community that maintains it. The outcome of stage 0 will determine whether we continue pursuing this endeavour or not. We will use this stage to validate the idea. During this stage we will focus on developing our OSS products. We will also lay the foundations for our development practices and build a strong engineering community.

#### The Flagbase Protocol

“The Flagbase Protocol” - will be the name of the whitepaper that describes our take on designing a efficient feature delivery protocol. The whitepaper will explore different evaluation techniques and do a cost-benefit analysis for evaluating flags in the different context (ie. provider-side evaluation and consumer-side evaluation). It’s important for us to publish a technical whitepaper which will bring in an air of legitimacy to this entire endeavour. The whitepaper will be available from our landing page (ie. [flagbase.com](https://flagbase.com)).

**_Client-side Evaluation_**
![Client-side Evaluation Diagram](/assets/blog/introducing-flagbase/client-side-evaluation.png)

**_Server-side Evaluation_**
![Server-side Evaluation](/assets/blog/introducing-flagbase/server-side-evaluation.png)

In our white paper we will use a toy problem to describe the requirements of a feature management service. We will go further in-depth in the system design and describe an efficient serialisation technique - specifically designed for flagsets and rulesets so they can be transported to the client and evaluated efficiently on the client. We will evaluate varies transports (i.e. Server-Sent Event / Polling) and highlight the pros and cons of each method.

**_Note:_** The white paper aim of this white paper will be to address the technical challenges faced by feature management services. It should be very low-level and technical in nature. We need to actually prove our claims by testing them in a simulated environment. The white paper will not advertise our OSS product.

#### Flagbase OSS

The crux of stage 0 will consist of the development of our open-source products. We will aim to get a fully-functioning service out before Feb, 2021. We have 2 start-ups and 1 SME willing to trial our solution.

##### Core

The core is essentially the feature flagging micro-service that’ll handle requests from the SDK. MVP features for the core consist of:

- JSON API that’ll help manage the following resources:
  - Workspaces
  - Projects
  - Environment
  - Flags
  - Targeting (/ Rules)
  - Segments (/ Rules)
- Auditing capabilities
- Resource access management via Casbin
- Service monitoring via Prometheus
- Two delivery modes:
  - Polling via HTTP
  - Streaming via SSE

##### Core

CLI will be a simple go-based executable which will make managing resources easier. Developers will be encouraged to use the CLI over the JSON API as it’ll be stateful (i.e.. keep track of workspaces, projects, environments etc).

##### SDKs

We’ll write basic SDKs in 3 most popular languages (JS, Python & Java), that’ll allow both polling and streaming modes.

### Development Practices

During this stage, it’s vital for us to establish engineering practices that’ll help us build robust applications in the future. Some aspects we need to consider:

- **_Documentation_**: We need to document compulsively, ingraining it in our development culture. If it’s not documented, it does not exist. We also need to run usability tests on our documentation and see how quickly a new starter can be on boarded given only a few hints.
- **_Monitoring_**: We need to instrument key services and build an automated system to analyse metrics and how changes affect performance overtime.
- **_Testing_**: We need to pedantic about testing, which can be measured through test coverage analysis (e.g. branch, statement, call coverage etc) We also need to ensure a certain % of branch coverage before a PR can be merged.

### Org Culture & Values

#### Distributed Development

Flagbase will be a fully decentralised organisation. During this stage, we will collate a set of heuristics that’ll enable use to effectively collaborate remotely, regardless of time zone. We will also need to set up supporting IT infrastructure that’ll help us collaborate. Since the company will be bootstrapped during stage 0, we need to find low/zero-cost solutions. Our initial business stack my consist of the following:

- Email → ZohoMail
- Documentation
  - Internal → Confluence
  - External → Docusaurus
- Community
  - Internal → Slack
  - External → Spectrum.chat
- Repo
  - OSS → Github
  - Proprietary → Github

#### Values

During this stage, it's important we establish some shared values. Some of these values include:

- **_Actions > Words_**:
  - If you have an idea, take initiative and actually do it.
  - Show don’t tell. If you have an idea, rather than writing up proposals, spike something really quickly. It’s better to have something to show than nothing, when proposing new projects/ideas.
- **_Pragmatic development_**:
  - Choose the pragmatic solution for the 80% that does not matter. Only use the first-principles approach for the 20% that matters, since it requires a lot of effort.
- **_Document obsessively_**:
  - If it’s not documented, it does not exist.
  - Always provide context, when writing up documentation.
  - It’s okay to repeat yourself when writing docs - don’t use the DRY principle when documenting.
- **_Radical transparency_**:
  - It’s okay to think-out-load (via messaging or video-conferencing), so others have an understanding of your perspective(s). Do not expect a reply from these think-out-load messages, they are just for others to observe your current thoughts.
  - If you have question, just ask. Don’t obsess if others are judging. Most-likely some-else has the same question as you do.
  - We’d rather you share concerns openly, rather than keeping them to yourself.

### Community

During this stage, we need to lay the foundations for a strong engineering-focused community to thrive in, by leveraging our values (esp. via radical transparency and documenting everything).

One thing we need to emphasise to our community is that they can use all things open-source and will not miss out on anything. We will NOT follow the open-core model in-which the software lacks essential features, only accessible to the user if they pay for it. Our development focus will be OSS-first, even if it means less revenue in the short-run. Even our experimentation features should be completely free and still be accessible to all developers, regardless if they’re using our cloud product.

Our cloud product will just attempt at making use of the service easier across teams. It’ll provide developers will a simple web interface which they can use to manage resources. However, they will be able to achieve the same functionality (perhaps in a less user-friendly way) using the CLI.

### Later Stages

- Stage 1 - More SDKs / Flagbase Extensions
- Stage 2 - Managed Multi-tenant Cloud
  - Flagbase Cloud will provide a easy-to-use web-interface, allowing developers to manage resources. When developing the product, we will focus usability within a team.
- Stage 3 - Enterprise (Managed Single-tenant Cloud / On-premise Cloud)

## Resources

- [Read our documentation](https://flagbase.com/docs)
- [Join our community](https://spectrum.chat/flagbase)
- [Star the project on GitHub](https://github.com/flagbase/flagbase)
