---
sidebar_position: 2
---

# Instance

An "instance" refers to a [Flagbase core](https://flagbase.com/oss#core) installation, running on a single [VPS](https://en.wikipedia.org/wiki/Virtual_private_server) or clustered in a datacenter. Flagbase uses [postgres](https://www.postgresql.org) as the main datastore used to store resources. Everything in a single postgres database represents a single Flagbase instance. You can have multiple hosts runnning [Flagbase core](https://flagbase.com/oss#core), but if they all share the same database, we refer to that as a "single instance".

Your organisation can run a single Flagbase instance to serve feature flags for all your projects. You can only run an instance of Flagbase for each project, however managing an instance per project can be laborious. We recommend you run a single instance shared across your projects as this will allow you to share flags accross products. This is useful for when you want to run cross-product experiments.
