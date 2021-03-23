# Flagbase Core

The core is the primary microservice feature flag clients interact with when making requests.

## Getting started

In order to run the service locally, you will need to have [docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/) installed on your machine.

### Starting up services
```sh
docker-compose up
```

### Creating a root user
```sh
docker-compose exec core ./bin/flagbase manage access create --key=<ACCESS_KEY> --secret=<ACCESS_SECRET> --type=root
```

### Check that it's working
```sh
curl -P GET http://localhost:5051/healthcheck
```

### Remove all containers and volumes (fresh-start)
```sh
docker-compose down -v
```


## Metrics

To view metrics about the whole my app container use:
```
http://localhost:8080/docker/flagbase-core
```

To view metrics using prometheus' query use:
```
http://localhost:9090/graph
```
