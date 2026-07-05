# Tooling

## Executive Summary

- Bun is the only package manager and runtime for project scripts.
- Biome owns formatting and linting.
- `bun test` is reserved for unit tests once reusable behavior exists.
- Knip and Fallow provide dependency, dead-code, duplication, and health checks.
- markdownlint checks committed Markdown outside generated skill folders.

## Commands

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the Next.js development server. |
| `bun run format` | Apply Biome formatting and safe fixes. |
| `bun run lint` | Run Biome lint rules. |
| `bun run test` | Run co-located Bun tests. |
| `bun run typecheck` | Run TypeScript with `--noEmit`. |
| `bun run build` | Build and export the static site. |
| `bun run check` | Run the full verification gate. |

## Health Checks

Knip checks unused files, exports, dependencies, and unresolved imports using `knip.json`.

Fallow runs dead-code, duplication, and health analysis. Duplication thresholds and ignores use Fallow defaults until this codebase grows enough to need project-specific tuning.

## Markdown

markdownlint uses `.markdownlint-cli2.jsonc` and excludes generated skill folders so vendor skill documentation does not block local project docs.

## Project Skills

Use `bunx skills` for project-local skill changes. The installed skills are tracked in `skills-lock.json` and materialized into agent folders.
