---
id: architecture
title: Architecture
sidebar_label: Architecture
---

## Overview
In this page we go through each software component that make up the Core. As you can see in the diagram, clients and external resources are also shown, however we will not go into much detail about those components. Please visit the respective development doc pages for more design details about the [SDKs](/dev/sdk/getting-started) and [UI](/dev/ui/getting-started).

<iframe frameborder="0" width="100%" height="873px" src="https://viewer.diagrams.net/?highlight=0000ff&edit=_blank&layers=1&nav=1&title=flagbase-core-architecture#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D14BTVmGaUp5bWzauk8r9z2LC9TOH71bad%26export%3Ddownload"></iframe>

If you can't see the diagram above, your browser may not support iframes. You can use [this link](https://viewer.diagrams.net/?highlight=0000ff&edit=_blank&layers=1&nav=1&title=flagbase-core-architecture#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D14BTVmGaUp5bWzauk8r9z2LC9TOH71bad%26export%3Ddownload) to view original diagram.


## Layers
As illustrated in the diagram components that make up the core can be categorised into three layers (i.e. [interfaces](#interfaces), [services](#services), [dependencies](#dependencies)). In order to prevent [circular dependencies](https://en.wikipedia.org/wiki/Circular_dependency), each component is split into tiny packages. Each flagbase package (`pkg`) is responsible for a single task (or operation).

### Interfaces
Interfaces are the top-most layer, in terms of dealing with interactions from service consumers (i.e. SDKs and UI). Interfaces are responsible for establishing the contract between consumers and the service. They essentially allow consumers to access components in the service layer in a safe way. Below we will go into the three key interfaces provided by the core.

#### API

The [API (Application Programming Interface)](https://en.wikipedia.org/wiki/API), is the primary consumable interface for accessing resources. It is essentially a server which processes HTTP requests. In terms of the contract, the API follows the [JSON:API specificiations](https://jsonapi.org/format/). Please visit the [API docs](/docs/api) for more info regarding actual usage.

#### Polling
Polling interface is responsible for providing the contract for SDK consumers who choose to use polling as the primary mechanism to retrieve raw or evaluated flagsets. It is essentially a HTTP-based server (similar to the [API](#api)), that provides a state-less transport mechanism. State related info is maintained implicitly via the polling contract. We recommend consumers using unreliable networks (e.g. mobile networks), rely on polling instead of streaming. You can read more about polling and its use cases [here](https://javascript.info/long-polling).

#### Streamer
The streamer is responsible for providing SDK consumers with push-based transport mechanism to retrieve raw and evaluated flagsets. [SSE (Server-sent Events)](https://en.wikipedia.org/wiki/Server-sent_events) is the protocol used to push updates from the service to consumers. SSE is http-based, hence can be widely adopted by all sorts of clients.

### Services
Components in the service layer are responsible for majority of the business logic. Services are heavily-reliant on dependencies and provide functionality used by interfaces. Services deal with authorization (/ policy enforcement) responsible for managing entities in the datastore.

#### Resources
One of the primary service-types are resource services. Resource services help manage entities in a safe way, providing operation authorisation (via [casbin policies](https://casbin.org/)). If you want more details about specific resources, see the [data-models page](/dev/core/data-models#resources).

#### Evaluation
Evaluation services are dependant on by the streamer and polling interfaces to provide evaluated flagsets to consumers. Evaluation is highly reliant on the targeting, segment and flag resource services. Evaluation also relies on cached resources for better performance. For more context about the actual evaluation process, please take a look at our [targeting RFC](https://flagbase.atlassian.net/wiki/spaces/OSS/pages/556367945/RFC+-+Targeting).

### Dependencies
The dependencies layer provide a high-level abstraction on-top of official libraries used to communicate with external resources. Providing a wrapper around exisiting libraries may seem quite redundant, however this extra layer of abstract can beneficial in terms of providing additional safety mechanism. In the long-run, we can also switch to using another external resource (e.g. switching from postgres -> some other [DBMS](https://en.wikipedia.org/wiki/Database)).

#### Database
The database dependency is a wrapper on top of other DBMS libraries, offering query and excution handlers on a given connection (or connection pool). It is **NOT** an ORM, rather an interface which takes in standard SQL queries and translates these requests to be handled by the underlying DBMS provider. Please note that we currently only support [Postgres](https://www.postgresql.org/).

#### Cache
Similiarly to the database dependency, the cache dependency offers a wrapper ontop of existing cache providers. It provides common cache handlers (i.e. `GET`, `SET`, `DEL` etc) used to communicate with a key-value datastore. Currently, the only cache provider we support is [Redis](https://redis.io/).

#### Metrics
For service telemetry, the metrics dependency is relied upon by components in the service layer. For example, if you want to time a particular operation, you can use the metrics client to capture the execution time period. The metrics dependency is a wrapper ontop of the prometheus client, providing easy to use handlers.
