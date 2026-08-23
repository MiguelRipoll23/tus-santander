# TUS Santander — Agent Guidelines

## Project Overview

**Tech stack:** Vite · React · TypeScript · CSS Modules · Lucide icons · @dnd-kit · @vis.gl/react-google-maps · vite-plugin-pwa  
**Build:** `npm run dev` / `npm run build` / `npm run lint`  
**No testing framework, no React Router (custom useReducer-based routing), no CSS-in-JS.**

---

## Project Hierarchy

```
src/
├── assets/              # Static assets (images, markers)
├── components/          # Shared/reusable UI components (one dir per domain)
│   ├── estimations/     # EstimationsCard, EstimationsList, etc.
│   ├── home/            # HomeMenu, HomeDesktop, etc.
│   ├── map/             # ClosestMarkers, etc.
│   └── route-line/      # RouteMapCard, etc.
├── constants/           # ViewConstants, LineConstants, TelemetryConstants
├── contexts/            # React contexts (I18nContext, ViewContext)
├── i18n/                # {lang}.json flat key-value translations (8 languages)
├── interfaces/          # TypeScript interfaces
├── json/                # Static JSON data files
├── providers/           # Context providers (I18nProvider, ViewProvider)
├── reducers/            # useReducer reducers (ViewReducer)
├── types/               # TypeScript type aliases
├── utils/               # Utility functions (ApiConstants, LineUtils, etc.)
├── views/               # Top-level routed views (one dir per view)
│   ├── estimations-line/
│   ├── estimations-stop/
│   ├── home/
│   │   └── subviews/    # HomeFavoritesSubview, HomeSearchSubview
│   ├── map/
│   └── route-line/
├── index.css            # Global styles
└── index.tsx            # Entry point
```

---

## Naming Conventions

| Pattern | Applies to | Examples |
|---|---|---|
| **PascalCase** | Component files, interfaces, types | `Button.tsx`, `i18n.ts`, `line.ts` |
| **PascalCase + suffix** | Views (`*View`), Subviews (`*Subview`), Contexts (`*Context`), Providers (`*Provider`), Reducers (`*Reducer`), Utils (`*Utils`), Constants (`*Constants`) | `HomeView`, `I18nContext`, `ViewReducer`, `LineUtils` |
| **kebab-case** | Directories | `route-line/`, `estimations-stop/` |
| **snake_case** | i18n keys, View/action IDs | `"confirm_remove_favorite"`, `"estimations_stop"` |
| **UPPER_SNAKE_CASE** | Constant values | `INITIAL_VIEW_ID`, `API_HOST` |
| **camelCase** | Hooks (`use*`), CSS Module classes in JS | `useI18n()`, `styles.content` |
| **lowercase** | Translation files (2-letter code) | `en.json`, `es.json`, `ca.json` |

**Also:**
- Component functions use **named `function` declarations**, not arrow functions.
- Props interfaces are **co-located**, named `{ComponentName}Props`.
- Components use **`export default`**.
- CSS Module files match their component name with `.module.css` extension.

---

## Component Best Practices

### Structure
- **Named function declarations only** (no `const Component = () =>`).
- **Props interface** co-located above the component, named `{ComponentName}Props`.
- **Return type** `React.JSX.Element` (or `ReactNode` / `null` when applicable).
- **`export default`** at the bottom of the file.
- **CSS Modules only** — import as `import styles from "./ComponentName.module.css"`.
- One component **per file**, with small focused sub-components extracted.

### Avoid Giant Components
- Extract repeated JSX into named sub-components.
- Break views >200 lines into smaller pieces stored in `components/{domain}/`.
- Extract inline event handlers into `useCallback` or named functions.
- Move `useReducer` reducers/types to separate files when they grow beyond ~50 lines.

---

## i18n Requirements

- **All user-facing strings** must use `getText("key")` from `useI18n()`.
- **Translation files** live in `src/i18n/{lang}.json` with flat snake_case keys.
- **Adding a new key:** add it to all 8 language files (`ca`, `da`, `en`, `es`, `fr`, `it`, `pl`, `pt`).
- If a string contains **HTML**, use `dangerouslySetInnerHTML` (only when necessary, already used for `desktop_instructions`).
- **Usage:** `useI18n()` returns `{ getText }`, call `getText("key")` in JSX.

### Supported languages
Catalan (`ca`), Danish (`da`), English (`en`), Spanish (`es`), French (`fr`), Italian (`it`), Polish (`pl`), Portuguese (`pt`).

### Existing keys (20 total)
`favorites`, `map`, `search`, `done`, `use_map_or_search`, `see_nearby_stops`, `confirm_remove_favorite`, `location_not_available`, `no_available`, `try_again`, `view_route`, `refresh`, `add_to_favorites`, `qr_code`, `desktop_instructions`, `donation_message`, `tip`, `maybe_later`

---

## React Best Practices

1. **Hooks at top level** — never inside conditions/loops/callbacks.
2. **`useCallback` / `useMemo`** for stable references passed to child components or effect deps.
3. **`useEffectEvent`** (React 19) for event-like logic in effects (see `EstimationsStopView.tsx`).
4. **`useReducer`** for state with multiple sub-values or complex transitions.
5. **Avoid `any`** — `no-explicit-any` is an **error**; use `unknown` then narrow.
6. **No prop-types** — `react/prop-types` is off; use TypeScript interfaces.
7. **Data fetching** — plain `fetch` with `.then()/.catch()` (no React Query/SWR). Use `useCallback` + `useReducer`.
8. **CSS Modules** — no CSS-in-JS. Class names in camelCase within JS.
9. **No React Router** — use `useView()` for navigation (`setViewId`, `setViewIdWithData`, `setSubViewId`).
10. **Lucide icons** for icon needs; custom icon font for system-style icons.
11. **Inline SVG** acceptable for small custom graphics.
12. **`react/only-export-components`** (warn) — export only components from a file, or use `allowConstantExport`.

---

## Lint Rules (enforced)
| Rule | Severity |
|---|---|
| `no-explicit-any` | error |
| `react/rules-of-hooks` | error |
| `react/exhaustive-deps` | warn |
| `react/only-export-components` | warn |
