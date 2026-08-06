# Architecture

## General source-code rules

1. Business logic belongs in backend services.
2. Controllers do not access Prisma directly.
3. React pages do not issue direct HTTP requests.
4. Repositories are the only backend modules that access Prisma.
5. Frontend API calls are isolated in feature API modules.
6. Source files must not exceed 350 lines.
7. Comments explain non-obvious decisions, business rules or workarounds.
8. Comments in English code are written in English.
9. Self-explanatory code is not commented.
10. Battle.net secrets never leave the backend.

## Backend dependency direction

routes
  -> controllers
    -> services
      -> repositories
        -> Prisma

Third-party integrations are isolated in dedicated integration
modules.

## Frontend dependency direction

pages
  -> feature components and hooks
    -> feature API modules
      -> shared HTTP client

Shared modules must not import business feature modules.