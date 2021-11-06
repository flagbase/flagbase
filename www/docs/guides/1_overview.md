---
id: overview
title: Concepts
sidebar_label: Concepts
---

## Resources

The diagram below illustrates the Flagbase's resource hierarchy. To simplify the diagram, [identity](#identity) and [targeting](#targeting) have not been included in this diagram.

To summarise the diagram below, all resources belong to a single instance. A workspaces is used to hold project(s). A project contains flags and segments. A project can have multiple environments, allowing you to have different targeting rules per environment.

<iframe frameborder="0" width="100%" height="500px" src="https://viewer.diagrams.net/?edit=_blank&layers=1&nav=1&title=flagbase-resource-heirarchy#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1t8Yps8UuEnMuNyaUcjHNw2ahy8ECRTou%26export%3Ddownload" />

If you can't see the diagram above, your browser may not support iframes. You can use [this link](https://viewer.diagrams.net/?edit=_blank&layers=1&nav=1&title=flagbase-resource-heirarchy#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1t8Yps8UuEnMuNyaUcjHNw2ahy8ECRTou%26export%3Ddownload) to view original diagram.

Below is a high-level overview of each resource. If you want to go more indepth about the purpose of each resource and their relationship with other resources with examples, please visit the represent resource page in the guides section. If you wish to get a in-depth overview of data-models used by Flagbase, please read through the [data-models section](/dev/core/data-models) in the dev section.

* **[Instance](/docs/guides/instance)** is a [Flagbase core](https://flagbase.com/oss#core) installation, running on a single [VPS](https://en.wikipedia.org/wiki/Virtual_private_server) or clustered in a datacenter. Flagbase uses [postgres](https://www.postgresql.org) as the main datastore used to store resources. Everything in a single postgres database represents a single Flagbase instance. You can have multiple hosts runnning [Flagbase core](https://flagbase.com/oss#core), but if they all share the same database, we refer to that as a "single instance".
* **[Access](/docs/guides/access)** is a key/secret pair used to restrict operations on a particular resource via the policy enforcer. You can create and attach access to workspace, project and environment resources.
* **[Workspace](/docs/guides/workspace)** is the top-level resource which is used to group projects. A workspace can only be created by a root user, which you only have access to if you own a particular instance. You can have multiple workspaces per instance. Every workspace will have a unique key, per instance.
* **[Project](/docs/guides/project)** represents a collection of flags and segments. A project can have multiple environments that correspond to different targeting states.
* **[Environment](/docs/guides/environment)** A project can have multiple environments (e.g. dev, staging, production) which correspond to different targeting states. This means if you modify a flag's targeting or a segment's rules in one environment, your changes will be scoped to that particular environment. This allows you to have different targeting rules for flags and segments in each environment.
* **[Flag](/docs/guides/flag)** (aka feature flag, toggle, switch etc) represents a particular point in code which when evaluated determines the state of a feature. Flags hold different variations (i.e. on/off, true/false, A/B/C), which are only revealed upon evaluation.
* **[Identity](/docs/guides/identity)** (aka user) refers to a flag observer/consumer who requests to evaluate a flag. An identity consists of a set of traits. These traits are used as the context which is used during evaluation.
* **[Segment](/docs/guides/segment)** is used to group users based on their characteristics (i.e. traits). Segments are made up of one or more rules that is used to filter out a portion of your users. Segments provide a method to capture common targeting rules - allowing you to reuse these rules across different flags.
* **[Targeting](/docs/guides/targeting)** is a spec used to determine a flag's variaation. This spec consists of a set of rules which when evaluated using a user's context (i.e. traits), determines which variation of a flag that particular user will recieve. So essentially you could say targeting rules are conditions mapped to a variation. A flag's targeting rules are scoped to a particular project environment.
