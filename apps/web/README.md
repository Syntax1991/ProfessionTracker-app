# SynTrack Web App

This directory is the executable React application shell. It is not a
business module.

The shell owns only cross-module application concerns:

- browser startup
- top-level routing and module registration
- shared layouts, navigation, styles and technical UI primitives
- shared HTTP-client infrastructure

Domain pages, components, hooks and API clients belong under:

```text
modules/<main-module>/web
```

The Web app imports those module entrypoints and composes them into one
deployable product. It must not become a second location for
module-specific business logic.

## Development

Run all SynTrack development processes from the repository root:

```powershell
npm run dev
```

The Web app is served at `http://localhost:5173`.
