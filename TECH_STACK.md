# Tech Stack

- Runtime and package manager: Bun 1.3.14.
- Web framework: Next.js 16.2.10 with the App Router.
- Site output: static export with `output: "export"` in `next.config.ts`.
- UI runtime: React 19.2.4 and React DOM 19.2.4.
- Language: TypeScript with strict checking and `tsc --noEmit`.
- Styling: Tailwind CSS 4 through `@tailwindcss/postcss`.
- Visual assets: ImageGen-generated raster PNG assets served from `public/generated`.
- Performance monitoring: Vercel Speed Insights through `@vercel/speed-insights` 2.0.0.
- Formatting and linting: Biome 2.2.0.
- Unit test runner: `bun test --pass-with-no-tests`.
- Git hooks: Lefthook 2.1.9.
- Dependency and dead-code checks: Knip 6.24.0.
- Codebase health and duplication checks: Fallow 2.104.0.
- Markdown linting: markdownlint-cli2 0.23.0.
- Project-local skill management: `bunx skills` with `skills-lock.json`.
