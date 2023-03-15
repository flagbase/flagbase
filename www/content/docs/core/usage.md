---
sidebar_position: 2
---

# Usage

Flagbase Core Daemon is a primary process for managing Flagbase Core. This user-friendly guide will provide an overview of various commands and their options to effectively manage and operate the daemon.

## Getting Started

To start using the Flagbase Core Daemon, enter the following command:

```bash
flagbased [global options] command [command options] [arguments...]
```

### Global Options
* `--help, -h`: Show help (default: false)


## Worker Management

The worker command is used to manage Flagbase workers, such as API, GraphQL, Streamer, and Poller.

```bash
flagbased worker [arguments...]
```

### Starting a Worker
To start a specific worker or all workers, use the start command:

```bash
flagbased worker start [command options] [arguments...]
```

Options
* `--mode value`: Type of worker to run (i.e., all (default), api, streamer, polling) (default: "all")
* `--host value`: Server host address (default: "0.0.0.0")
* `--api-port value`: API port number (default: 5051)
* `--streamer-port value`: Streamer port number (default: 7051)
* `--poller-port value`: Poller port number (default: 9051)
* `--pg-url value`: Postgres Connection URL (default: "postgres://flagbase:BjrvWmjQ3dykPu@db:5432/flagbase?sslmode=disable")
* `--redis-addr value`: Redis address (host:port) (default: "redis:6379")
* `--redis-pw value`: Redis password
* `--redis-db value`: Redis database (default: 0) (default: 0)
* `--verbose, -v`: Enable logging to stdout (default: false)
* `--help, -h`: Show help (default: false)

## Resource Management

The **manage** command is used to manage Flagbase resources, such as `access` and `migrations`.

```bash
flagbased manage command [command options] [arguments...]
```

### Access Resources

Manage access resources using the access command:

```bash
flagbased manage access command [command options] [arguments...]
```

#### Creating Access Resources

To create access resources, use the create command:

```bash
flagbased manage access create [command options] [arguments...]
```

Options
* `--key value`: Access key (default: "root")
* `--secret value`: Access secret [this should never be exposed] (default: "toor")
* `--type value`: Access type [root > admin > user > service] (default: "root")
* `--pg-url value`: Postgres Connection URL (default: "postgres://flagbase:BjrvWmjQ3dykPu@db:5432/flagbase?sslmode=disable")
* `--redis-addr value`: Redis address (host:port) (default: "redis:6379")
* `--redis-pw value`: Redis password
* `--redis-db value`: Redis database 