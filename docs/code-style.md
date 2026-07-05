# Code Style

## Executive Summary

- Keep route files in `src/app` and domain logic in named folders such as `src/offside`.
- Use explicit names that describe football concepts and UI roles.
- Prefer one public export per file.
- Use Tailwind for styling and Biome for formatting.
- Keep source-tested law logic separate from explanatory copy.

## Naming

Use names that match the football domain. Prefer full concepts such as `secondLastDefender` or `opponentsHalf` over abbreviations.

## Components

UI components belong under `src/components`. Keep `src/app` focused on App Router route files and route-level composition.

## Domain Logic

Rule logic belongs under a named domain folder and should have co-located tests. Avoid burying reusable law logic inside JSX when it can be independently tested.

## Styling

Use Tailwind classes in components and reserve `src/app/globals.css` for global tokens and base element rules.
