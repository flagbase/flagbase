---
slug: introducing-flagbase
title: Introducing Flagbase
authors: cjoy
tags: [announcement]
---

We are pleased to introduce Flagbase, an open-source feature management solution that enables teams to safely release features by utilizing feature flags. You can find Flagbase on GitHub at [https://github.com/flagbase/flagbase](https://github.com/flagbase/flagbase).

:::info
At the time of writing this blog post, the project is still in development and is **NOT** yet at a usable state.
:::

<!--truncate-->


## The Plan

The following is a collection of my thoughts when initially starting Flagbase. I have attempted to structure a journey for the team, which essentially serves as an informal roadmap disguised as a blog post. This journey has been divided into well-defined stages. Although these stages are not intended to be linear, they should be executed in parallel. However, the success of some stages may depend on the progress of other stages.

### Vision
Please note that the vision statements and stages outlined below are subject to change in the future.
- The vision for Flagbase is to become the industry standard feature management solution. We aim to define best practices for feature flag delivery, targeting attributes management and feature evaluation. The Flagbase Protocol is intended to become synonymous with the "gold-standard" for serializing, transporting, and evaluating flagsets and rulesets.
- We strive for Flagbase to be recognized not only for being open-source but also for being the most efficient and flexible solution available. We believe that developers should be able to adapt Flagbase core to their own needs, given that change management and experimentation require slightly different solutions from a technical standpoint. Our goal is to bridge the divide between these different use cases and offer unparalleled flexibility.
- To provide advanced auditing capabilities, Flagbase leverages resource temporality via Postgres triggers. We use Hypertables (PG with TimescaleDB extension) to highly optimize all time-series queries. All resource mutations are automatically tracked, and we have data-layer fail-safes in place to prevent unauthorized mutations, preventing service-level resource misuse in case the service-layer Casbin Enforcer fails.
- Flagbase adopts a minimal resource access management layer, unlike some competitors who use permanent pre-generated SDK keys (such as LaunchDarkly, Split, ConfigCat, Optimizely, Rollout.io, etc.). Temporary user-generated access tokens are intended to become the standard, unifying resource authorization across different transports.
    
### Stage 0 - OSS Initialisation

During this stage, our focus will be on all things related to open source, including our open source software and the community that maintains it. The success of Stage 0 will determine whether we will continue to pursue this endeavor or not. Our main objective during this stage will be to validate the idea of Flagbase. We will focus on developing our OSS products, laying the foundation for our development practices, and building a strong engineering community.

#### The Flagbase Protocol

We plan to call our whitepaper "The Flagbase Protocol." This document will describe our approach to designing an efficient feature delivery protocol. It will explore various evaluation techniques and conduct a cost-benefit analysis for evaluating flags in different contexts, such as provider-side evaluation and consumer-side evaluation. It is essential for us to publish a technical whitepaper to bring legitimacy to our entire endeavor. The whitepaper will be available for download from our landing page, flagbase.com.

**_Client-side Evaluation_**
![Client-side Evaluation Diagram](/assets/blog/introducing-flagbase/client-side-evaluation.png)

**_Server-side Evaluation_**
![Server-side Evaluation](/assets/blog/introducing-flagbase/server-side-evaluation.png)

In our white paper, we will use a toy problem to illustrate the requirements of a feature management service. We will delve deeper into the system design and describe an efficient serialization technique specifically designed for flagsets and rulesets, making them transportable to the client and easily evaluated. We will evaluate various transports, such as Server-Sent Event and Polling, and highlight the advantages and disadvantages of each method.

It's important to note that the purpose of this white paper is to address the technical challenges faced by feature management services. The content should be very low-level and technical in nature. To substantiate our claims, we will test them in a simulated environment. Our white paper will not advertise our OSS product.

#### Flagbase OSS

The primary focus of stage 0 is the development of our open-source products, and we aim to have a fully-functioning service by February 2021. We have already secured interest from two startups and one SME who are willing to trial our solution.

##### Core

The core of Flagbase is the feature flagging micro-service that handles requests from the SDK. The minimum viable product (MVP) for the core includes the following features:
* A JSON API to manage the following resources:
  - Workspaces
  - Projects
  - Environments
  - Flags
  - Targeting/Rules
  - Segments/Rules
* Auditing capabilities
* Resource access management via Casbin
* Service monitoring via Prometheus
* Two transports: polling and streaming via Server-Sent Events (SSE).

##### CLI

The CLI is a Go-based executable that will provide an easier way to manage resources for developers. It will be stateful and keep track of workspaces, projects, environments, etc. We encourage developers to use the CLI over the JSON API for better management of resources.

##### SDKs

We will develop basic SDKs in the three most popular programming languages: JavaScript, Python, and Java. These SDKs will enable both polling and streaming modes.

### Development Practices

During this stage, it’s vital for us to establish engineering practices that’ll help us build robust applications in the future. Some aspects we need to consider:

- **_Documentation_**: We need to document compulsively, ingraining it in our development culture. If it’s not documented, it does not exist. We also need to run usability tests on our documentation and see how quickly a new starter can be on boarded given only a few hints.
- **_Monitoring_**: We need to instrument key services and build an automated system to analyse metrics and how changes affect performance overtime.
- **_Testing_**: We need to pedantic about testing, which can be measured through test coverage analysis (e.g. branch, statement, call coverage etc) We also need to ensure a certain % of branch coverage before a PR can be merged.

### Org Culture & Values

#### Distributed Development

Flagbase will be a fully decentralized organization, and during this stage, we will develop a set of heuristics to enable us to collaborate effectively remotely, regardless of time zone. We will also set up supporting IT infrastructure that will help us collaborate. Since we will be bootstrapped during stage 0, we need to find low/zero-cost solutions. Our initial business stack may consist of the following:
- Email → ZohoMail
- Documentation
  - Internal → Confluence
  - External → Docusaurus
- Community
  - Internal → Slack
  - External → [Github dicussions](https://github.com/flagbase/flagbase/discussions)
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
- [Join our community](https://github.com/flagbase/flagbase/discussions)
- [Star the project on GitHub](https://github.com/flagbase/flagbase)
