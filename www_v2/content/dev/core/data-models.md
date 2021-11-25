---
sidebar_position: 3
---

# Data Models

## Overview
Here we explore data models used by Flagbase on a technical level. If you wish to get a higher-level overview, please read the [guides](/docs/guides/overview) in the user docs. Below is an [ER diagram](https://en.wikipedia.org/wiki/Entity%E2%80%93relationship_model), illustrating the relationships between different resources.

<iframe frameborder="0" width="100%" height="960px" src="https://viewer.diagrams.net/?edit=_blank&layers=1&nav=1&title=flagbase-erd.drawio#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1QU-hiWtnsl6gtU1xzcr8q36T5_bvUPfh%26export%3Ddownload" />

If you can't see the diagram above, your browser may not support iframes. You can use [this link](https://viewer.diagrams.net/?edit=_blank&layers=1&nav=1&title=flagbase-erd.drawio#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1QU-hiWtnsl6gtU1xzcr8q36T5_bvUPfh%26export%3Ddownload) to view original diagram.

## Resources

The diagram below illustrates the Flagbase's resource hierarchy. To simplify the diagram, [identity](#identity) and [targeting](#targeting) have not been included in this diagram.

<iframe frameborder="0" width="100%" height="500px" src="https://viewer.diagrams.net/?edit=_blank&layers=1&nav=1&title=flagbase-resource-heirarchy#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1t8Yps8UuEnMuNyaUcjHNw2ahy8ECRTou%26export%3Ddownload" />

If you can't see the diagram above, your browser may not support iframes. You can use [this link](https://viewer.diagrams.net/?edit=_blank&layers=1&nav=1&title=flagbase-resource-heirarchy#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1t8Yps8UuEnMuNyaUcjHNw2ahy8ECRTou%26export%3Ddownload) to view original diagram.

We will go into more depth about the purpose of each resource and their relationship with other resources, using examples to help understand key concepts. If you wish to get a higher-level overview of these resources, please read the [guides](/docs/guides/overview) in the user docs.

### Instance
An "instance" refers to a [Flagbase core](https://flagbase.com/oss#core) installation, running on a single [VPS](https://en.wikipedia.org/wiki/Virtual_private_server) or clustered in a data center accessible via a load balancer. Flagbase uses [postgres](https://www.postgresql.org) as the main datastore used to store resources. Everything in a single postgres database represents a single Flagbase instance. You can have multiple hosts running [Flagbase core](https://flagbase.com/oss#core), but if they all share the same database, we refer to that as a "single instance".

### Access
Access is a key/secret pair used to restrict operations on a particular resource via the policy enforcer. You can create and attach access to workspace, project and environment resources.

Flagbase uses [casbin](https://casbin.org/) to authorize operations on resources, based on the Flagbase [policy model](https://github.com/flagbase/flagbase/blob/master/core/internal/pkg/policy/policy_model.go). Upon creating an access key/secret pair, the secret is encrypted before being stored in the datastore. Access can expire after a certain time. The expiry time (i.e. `expires_at`) is stored as a unix timestamp. You can add additional meta-data to an access resource including a `name`, `description` and `tags`.

### Workspace
A workspace is the top-level resource which is used to group projects. A workspace can only be created by a root user, which you only have access to if you own a particular instance. You can have multiple workspaces per instance.

Every workspace has a unique `key`, per instance. You can add additional meta-data to an workspace resource including a `name`, `description` and `tags`.


### Project
A project represents a collection of flags and segments. In the real-world, a project can be mapped to a particular codebase for a service or package.

Every project has a unique `key`, per workspace. Every project has to belong to a particular workspace. You can add additional meta-data to an project resource including a `name`, `description` and `tags`.

### Environment
A project can have multiple environments (e.g. staging, production) which correspond to different targeting states. This means if you modify a flag's targeting or a segment's rules in one environment, your changes will be scoped to that particular environment. This allows you to have different targeting rules for flags and segments in each environment.

Every environment has a unique `key`, per project. A project must contain at least one environment. When you create a project, it also creates two environments for you (i.e. `staging` and `production`). You can add additional meta-data to an environment resource including a `name`, `description` and `tags`.

### Flag
A flag (aka feature flag, toggle, switch etc) represents a particular point in code which when evaluated determines the state of a feature. Flags hold different variations (i.e. on/off, true/false, A/B/C), which are only revealed upon evaluation.

Every flag has a unique `key`, per project. You can add additional meta-data to an flag resource including a `name`, `description` and `tags`. A flag must have two or more variations. When you create a flag, two variations are automatically created and assigned to that particular flag (i.e. `on`, `off`). You can add additional meta-data to an variation resource including a `name`, `description` and `tags`.

### Identity
An identity (aka user) refers to a flag observer/consumer who requests to evaluate a flag. An identity consists of a set of traits. These traits are used as the context which is used during evaluation.

Every identity has a unique key, per project environment. This key is automatically generated using trait information provided by the clients. For anonymous identities, a random hash will be used using meta-data from the context provided by clients.

### Segment
A segment is used to group users based on their characteristics (i.e. traits). Segments are made up of one or more rules that is used to filter out a portion of your users. Segments provide a method to capture common targeting rules - allowing you to reuse these rules across different flags.

Every segment has a unique key, per project. You can add additional meta-data to an segment resource including a `name`, `description` and `tags`. A segment consists rules (i.e. `segment_rules`). These rules also contain a `key` which is unique the segment which is used to identify that particular rule. Segment rules contain an operator (i.e. `equal`, `greater_than`, `greater_than_or_equal`, `contain`, `regex`) which combined with the `negate` field will allow you to represent any condition on a particular user trait. You can add additional meta-data to an segment rules including a `name`, `description` and `tags`.

### Targeting
Targeting is a spec used to determine a flag's variation. This spec consists of a set of rules which when evaluated using a user's context (i.e. traits), determines which variation of a flag that particular user will receive. So essentially you could say targeting rules are conditions mapped to a variation. A flag's targeting rules are scoped to a particular project environment.

Targeting for a particular flag consists of a fallthrough variation (i.e. the default variation users will receive when no targeting rules are satisfied or when targeting is not enabled). Targeting rules contain a `key` which is unique the targeting object which is used to identify that particular rule. Targeting rules contain an operator (similar to the one used by segment rules ~ i.e. `equal`, `greater_than`, `greater_than_or_equal`, `contain`, `regex`) which combined with the `negate` field will allow you to represent any condition on a particular user trait. You can add additional meta-data to an targeting rules including a `name`, `description` and `tags`. Targeting rules can also be weighted (0 ... 100), allowing you to randomly rollout to certain percentage of users who match a particular rule. The fallthrough variation can also be weighted.

## Design Strategy
It is important to balance the extend to which data models are normalized to optimise for both storage and query performance. Flagbase's data models are in [2NF](https://en.wikipedia.org/wiki/Second_normal_form), ensuring key entities are split into different tables. However, entity-specific meta data (i.e. `name`, `description`, `tags` etc) have not been split into a different table and belong to the original resource table. This is to avoid additional joins on queries and mutations.

Triggers and procedures are used to enforce validation of resource characteristics. Data validation is done in the database layer, to ensure additional safety, which will help catch errors that are not handled properly in the application layer. However, there's a performance cost of adding these validators in the database layer, so high-traffic resource paths should be handled in the application layer.
