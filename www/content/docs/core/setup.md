---
sidebar_position: 1
---

# Setting Up


## Setting up using Docker
### Prerequisites
Docker installed on your machine. You can download it from [https://www.docker.com/get-started](https://www.docker.com/get-started).

### Setup
1. Create a new directory for your Flagbase project and navigate to it in your terminal.

```bash
mkdir flagbase && cd flagbase
```
2. Create a new file named `docker-compose.yml` and copy the following contents into it:
```bash
version: "3"

services:
  core:
    container_name: flagbase-core
    image: cosmtrek/air
    working_dir: /go/src/github.com/flagbase/flagbase/core
    ports:
      - 5051:5051
      - 7051:7051
      - 9051:9051
    environment:
      FLAGBASE_CORE_PG_URL: user=flagbase password=BjrvWmjQ3dykPu database=flagbase host=db port=5432
      FLAGBASE_CORE_REDIR_ADDR: redis:6379
      FLAGBASE_CORE_REDIS_PASSWORD: ""
      FLAGBASE_CORE_REDIS_DB: 0
    volumes:
      - ./:/go/src/github.com/flagbase/flagbase/core
    depends_on:
      - db
      - migrations
    links:
      - db

  redis:
    container_name: flagbase-cache
    image: redis:latest
    ports:
      - 6380:6379

  db:
    container_name: flagbase-db
    image: postgres
    restart: always
    ports:
      - 5433:5432
    environment:
      POSTGRES_DB: flagbase
      POSTGRES_USER: flagbase
      POSTGRES_PASSWORD: BjrvWmjQ3dykPu
    volumes:
      - pgdata:/var/lib/postgresql/data

  migrations:
    container_name: flagbase-migrations
    build: .
    command: bash -c 'while !</dev/tcp/db/5432; do sleep 1; done; ./bin/flagbased manage migrate up'
    environment:
      FLAGBASE_CORE_PG_URL: postgres://flagbase:BjrvWmjQ3dykPu@db:5432/flagbase?sslmode=disable
    depends_on:
      - db
    links:
      - db

  prometheus:
    container_name: flagbase-metrics
    image: prom/prometheus:latest
    ports:
      - 9090:9090
    command:
      - --config.file=/etc/prometheus/prometheus.yml
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
    depends_on:
      - cadvisor

  cadvisor:
    container_name: flagbase-cadvisor
    image: gcr.io/google-containers/cadvisor:latest
    ports:
      - 8080:8080
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:rw
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    depends_on:
      - redis


volumes:
  pgdata:
```
3. Open a terminal window in the directory where the docker-compose file is located and run the following command to start the Flagbase Core containers:
```bash
docker-compose up -d
```

Congratulations, you have successfully set up Flagbase Core using Docker Compose! You can now start using it to server your SDK consumers. If you need to make any changes to the configuration or code, you can modify the appropriate files in the directories that were copied into the container during the build process.


## Setting up manually

This guide will walk you through setting up Flagbase Core without using Docker.

### Prerequisites

Ensure that you have the following software installed on your machine:

1. [Go](https://golang.org/dl/) (version 1.20.2 or higher)
2. [PostgreSQL](https://www.postgresql.org/download/)
3. [Redis](https://redis.io/download)

### Setting Up Flagbase Core

Follow these steps to set up Flagbase Core:

#### 1. Clone the repository

Clone the Flagbase Core repository to your local machine:

```bash
git clone https://github.com/flagbase/flagbase.git
cd flagbase/core
```

#### 2. Download dependencies

Download the necessary Go dependencies:

```bash
go mod download
```

#### 3. Build the executable
Build the executable using the Go build command:
```bash
go build -o ./bin/flagbased ./cmd/flagbased
```

#### 4. Set up PostgreSQL
Create a PostgreSQL database and user for Flagbase Core with the following credentials:
* Database name: `flagbase`
* User: `flagbase`
* Password: `BjrvWmjQ3dykPu`

#### 5. Set up Redis
Ensure that your Redis server is running and configured with the following settings:
* Address: `localhost:6379`
* Password: `"" (no password)`
* Database: `0`

#### 6. Configure environment variables
Set the following environment variables:

```bash
export FLAGBASE_CORE_PG_URL="user=flagbase password=BjrvWmjQ3dykPu database=flagbase host=localhost port=5432"
export FLAGBASE_CORE_REDIR_ADDR="localhost:6379"
export FLAGBASE_CORE_REDIS_PASSWORD=""
export FLAGBASE_CORE_REDIS_DB="0"
```

#### 7. Run database migrations

Run the database migrations using the Flagbase Core executable:
```bash
./bin/flagbased manage migrate up
```

#### 8. Run Flagbase Core

Start the Flagbase Core service by running the executable:
```
./bin/flagbased worker start
```

Flagbase Core will now be running, and you can begin using it for your feature management platform.