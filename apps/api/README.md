# SynTrack API App

This directory is the executable API server shell. It is not a business
module.

The shell owns only cross-module server concerns:

- process startup and environment configuration
- top-level route composition
- Prisma setup and migrations
- shared middleware and technical infrastructure

Domain controllers, services, repositories and routes belong under:

```text
modules/<main-module>/api
```

The API app mounts those module routes and supplies shared runtime
infrastructure without taking ownership of their business rules.
