# AGENTS.md

## Commands
- `npm run dev` — start dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — run ESLint

## Architecture
- Next.js 16 App Router with TypeScript + Tailwind v4
- Client-side color memory game (no backend yet)
- `src/lib/game.ts` — all game logic (HSB/RGB conversion, scoring, color generation)
- `src/components/Game.tsx` — main game state machine (menu → memorize → recreate → results)
- `src/components/MenuScreen.tsx` — solo/multiplayer/daily mode selection
- `src/components/MemorizeScreen.tsx` — shows 5 colors to memorize
- `src/components/ColorPicker.tsx` — HSB sliders for color recreation
- `src/components/ResultsScreen.tsx` — score breakdown and sharing

## Conventions
- Dark theme only (neutral-950 background)
- HSB color space for game logic, RGB/Hex for rendering
- Score: 0-1000 per color, displayed as X.XX/50
- Client components only (no SSR needed for game)

## Gotchas
- Tailwind v4 uses `@import "tailwindcss"` not `@tailwind` directives
- `next dev` may need `--turbopack` flag for faster HMR on Windows
- node_modules LSP errors about `next` module are false positives during install
