# Borders Exhibition - Docker Setup Guide

## Quick Start

```bash
docker run -d -p 8080:80 --name borders-exhibition ghcr.io/ri-bibi/borders-razstava:latest
```

Access at: [http://localhost:8080](http://localhost:8080)

## Changing the Port

To change the port, modify the `-p` option in the `docker run` command. For example, to use port 9090:

```bash
docker run -d -p 9090:80 --name borders-exhibition ghcr.io/ri-bibi/borders-razstava:latest
```

## Docker Compose method

create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  borders-exhibition:
    image: ghcr.io/ri-bibi/borders-razstava:latest
    ports:
      - "8080:80"
```

Then run:

```bash
docker-compose up
```

to run in detached mode, use:

```bash
docker-compose up -d
```
