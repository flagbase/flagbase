---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

[Flagbase Core](https://flagbase.com/oss#core) is the main service responsible for streaming feature flags to our SDKs via SSE (Server-Sent Events). It provides a REST API, used to manage key resources (i.e. workspaces, projects, environments, flags etc).

The core has multiple modes of operation (i.e. `all (default)`, `api`, `streamer`). The service can be run on multiple nodes (i.e. it is horizontally scalable).

## Quick Start

The quickest way to get the service running locally will require you to have [docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/) installed on your machine. If you want help compiling the binary and running locally, please use the [Core Dev Guides](https://flagbase.com/dev/core/getting-started).

1. Getting the source code
```sh
git clone git@github.com:flagbase/flagbase.git
cd flagbase/core
```
2. Starting up services
```sh
docker-compose up
```
3. Creating a root user
```sh
docker-compose exec core ./bin/flagbase manage access create --key=<ACCESS_KEY> --secret=<ACCESS_SECRET> --type=root
```
4. Check that it's working
```sh
curl -P GET http://localhost:5051/healthcheck
```

### Remove all containers and volumes (fresh-start)
```sh
docker-compose down -v
```

## Contributing
We encourage community contributions via pull requests. Before opening up a PR, please read our [contributor guidelines](/dev/intro/workflow#contributing).

## Resources
Check out these pages that'll help you get started, if you want to contribute to the core:
* [Core RFCs](https://flagbase.atlassian.net/wiki/spaces/OSS/pages/258539521/Core+-+RFCs): Technical RFCs / Proposals etc
