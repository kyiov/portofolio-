# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Start Vite dev server on http://localhost:3000
npm run build     # Production build into dist/
npm run preview   # Preview the production build
```

There is **no test runner, linter, or formatter** configured. `tsc` is available (via `typescript` dep) for type-checking but there is no `typecheck` script — run `npx tsc --noEmit` manually if needed.

## Architecture

Single-page React 19 + Vite + TypeScript portfolio. Everything renders from `App.tsx`, which composes section components (`Hero`, `About`, `Stack`, `Contact`) plus persistent `Navbar` and `MusicPlayer`. Entry point is `index.tsx` mounting into `#root`.

### Styling is CDN-driven, not built (critical gotcha)
Tailwind is loaded via `<script src="https://cdn.tailwindcss.com">` in `index.html` — **there is no `tailwind.config.js`, no PostCSS, and no CSS build step**. Consequences when editing styles:
- Tailwind config (theme extensions, the `accent` color) lives in an inline `<script>` tag inside `index.html`, not a config file.
- All custom CSS (cursor, noise/grid/scanline effects, glitch, `@keyframes`) lives in the `<style>` block in `index.html`.
- **The `accent` color is defined twice and conflicts:** the inline Tailwind config sets `accent` to violet `#8b5cf6`, but hand-written `.text-accent` / `.bg-accent` / `.border-accent` classes in the `<style>` block override it with a cyan→blue gradient (`#00f2fe`). Utility classes like `text-accent` resolve to the gradient version, not the config color. Check both places when touching accent styling.
- `index.html` must not reference `/index.css` — that file does not exist.

### Custom cursor system
`App.tsx` runs an effect that imperatively drives two DOM nodes (`#custom-cursor`, `#cursor-follower`, declared in `index.html`) via mouse/touch listeners. A `MutationObserver` re-scans the DOM for `a`, `button`, and `.interactive` elements to attach hover handlers. When adding interactive elements that should trigger the cursor hover state, give them one of those selectors.

### Loading screen
The initial loading overlay is pure React state in `App.tsx`: a `setInterval` fakes `progress` from 0→100 (not tied to real asset loading), then unmounts the overlay via `AnimatePresence`. The visual is `components/MLoader.tsx` — an SVG "M" brand mark that self-draws with Framer Motion. There is intentionally **no static pre-loader in `index.html`** (`#root` is empty until React mounts).

### MusicPlayer
`components/MusicPlayer.tsx` is a self-contained hybrid player. It persists the current track to `localStorage` (`musicPlayerTrack`), defaults to a bundled MP3 in `public/audio/`, and its search fetches from an external third-party API (`https://api.kyio.web.id/api/dl/yt-play`) to resolve YouTube tracks to streamable URLs. Those download URLs can expire.

## Conventions
- Path alias `@/*` maps to the project root (configured in both `tsconfig.json` and `vite.config.ts`).
- Animation is done with **Framer Motion** throughout; prefer it over CSS transitions for new component animations to match existing code.
- Code comments and user-facing strings are frequently in **Indonesian** — follow the surrounding language of the file you edit.
- `design-system/muh4rhq-portfolio/MASTER.md` contains the design language reference (aesthetic direction, color/type intent).
- `node_modules/` and `dist/` are git-ignored; do not commit build output.
