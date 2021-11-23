# core

[Flagbase Core](https://flagbase.com/oss#core) is the main service responsible for streaming feature flags to our SDKs via SSE (Server-Sent Events). It provides a REST API, used to manage key resources (i.e. workspaces, projects, environments, flags etc).

The core has multiple modes of operation (i.e. `all (default)`, `api`, `streamer`, `poller`). The service can be run on multiple nodes (i.e. it is horizontally scalable).

## Quick Start

The quickest way to get the service running locally will require you to have [docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/) installed on your machine. If you want help compiling the binary and running locally, please use the [Core Dev Guides](https://flagbase.com/dev/core/getting-started).

### Starting up services
```sh
docker-compose up
```

### Creating a root user
```sh
docker-compose exec core ./bin/flagbased manage access create --key=<ACCESS_KEY> --secret=<ACCESS_SECRET> --type=root
```

### Check that it's working
```sh
curl -P GET http://localhost:5051/healthcheck
```

### Remove all containers and volumes (fresh-start)
```sh
docker-compose down -v
```

## Contributing
We encourage community contributions via pull requests. Before opening up a PR, please read our [contributor guidelines](https://flagbase.com/dev/intro/workflow#contributing).

## Resources
Check out these pages that'll help you get started, if you want to contribute to the core:
* [Core Dev Guides](https://flagbase.com/dev/core/getting-started): Building & running locally / Architecture / Data models etc
* [Core RFCs](https://flagbase.atlassian.net/wiki/spaces/OSS/pages/258539521/Core+-+RFCs): Technical RFCs / Proposals etc
