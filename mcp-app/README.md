# Transit Widgets (MCP Apps)

Interactive widgets for the TUS Santander MCP server, built with React,
type-safe TypeScript, Tailwind CSS, and the OpenAI Apps SDK. Widgets render
inside ChatGPT via the MCP Apps bridge (JSON-RPC over `postMessage`) and are
served by the backend as MCP Apps resource bundles.

## Tech stack

- [React 19](https://react.dev) + `@openai/apps-sdk-ui` design system
- [TypeScript 7](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/vite`
- [Vite 8](https://vite.dev) / [rolldown](https://rolldown.rs/dev/build)
- [oxlint](https://oxc.rs/docs/guide/usage/linter.html) for linting
- [react-intl](https://formatjs.github.io/docs/react-intl/) for
  internationalization

## Getting started

Uses [pnpm](https://pnpm.io):

```bash
pnpm install
pnpm dev           # local dev server (HMR)
```

## Scripts

| Script        | Description                                          |
| ------------- | ---------------------------------------------------- |
| `pnpm dev`    | Start the Vite dev server                            |
| `pnpm build`  | Typecheck (`tsc -b`) then production build           |
| `pnpm lint`   | Lint with oxlint                                     |
| `pnpm preview`| Preview the production build                         |
| `pnpm package`| Production build + write the resource `main.html`    |

## Packaging the widget

`pnpm package` runs the production build and inlines the emitted CSS/JS into a
single `main.html`. The file is written to:

- `dist/assets/main.html` (local build output)
- `../backend/static/widgets/estimations/main.html` (the resource served by the
  MCP server)

The backend reads that `main.html` as its `estimations-widget` resource, so run
`pnpm package` (or `pnpm run build`) before committing a widget change.

## Why a custom bridge?

`@openai/apps-sdk-ui` provides UI components and utility hooks only — there is
no official React bridge package. The hand-rolled `McpAppsBridge` in
`src/utils/mcp-apps-bridge-utils.ts` implements the standard MCP Apps bridge:
`ui/initialize`, `ui/notifications/initialized`, `tools/call`, and
`ui/notifications/*` notifications over `postMessage`, plus the `window.openai`
extensions.