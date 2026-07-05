# Architecture

## Executive Summary

- The site is a static Next.js App Router application exported to `out/`.
- `src/app` owns routes and route-level composition.
- The first route renders the actual slide-based offside explainer.
- `src/offside` owns source-tested rule logic used by the interactive decision lab.
- Project skills are materialized with `bunx skills` and tracked by `skills-lock.json`.

## Application Shape

What Is Offside is a single-surface static app. The route shell renders a client island from `src/components` for slide navigation and controls, while the offside decision logic lives in a named domain folder so it can be tested independently of the UI.

## Boundaries

- `src/app/page.tsx` is the framework entry point.
- `src/components/OffsideExplainer/OffsideExplainer.tsx` owns slide state and coordinates the visual/control components for the experience.
- `public/generated` stores ImageGen-generated raster football assets used by the pitch scene.
- `src/offside/getOffsideVerdict.ts` owns the decision logic used by the interactive lab.
- `src/app/globals.css` holds global styling tokens and base rules.
- UI components live under `src/components`; keep framework route files under `src/app`.

## Static Export

`next.config.ts` sets `output: "export"`, so `bun run build` emits a static site to `out/`. Avoid server-only features, route handlers, runtime cookies, or image optimization that requires a Next server.
