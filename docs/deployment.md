# Deployment

## Executive Summary

- The app builds as a static export with Next.js.
- The deployable artifact is `out/`.
- Vercel can host the app, but any static host that serves `out/` works.
- Server-only Next.js features are out of scope while static export is enabled.

## Build

```bash
bun run build
```

## Artifact

Next.js writes the static export to `out/`.

## Hosting

Deploy the contents of `out/` to a static host. If the app later needs server features, update `next.config.ts`, this document, and `AGENTS.md` together.
