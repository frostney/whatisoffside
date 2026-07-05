# Agent Instructions

<!-- BEGIN:nextjs-agent-rules -->
## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Hard Constraints

- Always validate. If source code is available, validate with source code.
- Bun only. Do not use `npm`, `pnpm`, or `yarn`; keep `bun.lock` as the only lockfile.
- This is a static Next.js App Router site. Keep `output: "export"` in `next.config.ts` unless the deployment model changes.
- Use TypeScript, React, Tailwind, and Biome. Do not add ESLint or Prettier.
- Keep route files under `src/app`; put reusable domain logic under a named `src/<domain>/` folder.
- Do not create `src/lib`, `src/helpers`, or catch-all utility folders.
- Installed project skills are managed with `bunx skills`; do not hand-edit `.agents/skills`, `agent/skills`, or `skills-lock.json`.

## Runtime / Commands

- Install: `bun install`
- Develop: `bun run dev`
- Format: `bun run format`
- Test: `bun run test`
- Full gate: `bun run check`
- Static build output: `out/`

## Code Organization

- `src/app` contains App Router route files.
- `src/components` contains UI components.
- Keep reusable rule logic under a named domain folder such as `src/offside`.
- Components use Tailwind classes and stay named after their public export.
- Prefer one public export per source file unless framework conventions require otherwise.

## Testing

- Use `bun test`.
- Keep unit tests co-located with the module they exercise as `*.test.ts` or `*.test.tsx`.
- Add tests when domain rules or reusable behavior are introduced.

## Safety / Boundaries

- Do not commit secrets or `.env*` files.
- Validate future rule changes against their source implementation and tests before changing explanatory copy.
- Keep the site educational and source-backed; avoid adding unsourced law claims.
