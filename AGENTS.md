# AGENTS.md

## Commands
- `npm run dev` — start dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — run ESLint

## Architecture
- Next.js 16 App Router with TypeScript + Tailwind v4
- Client-side color memory game (no backend)
- Auth via localStorage (no server auth)
- Leaderboard stored in localStorage

### File Structure
- `src/lib/game.ts` — CIEDE2000 scoring pipeline, HSB→RGB→XYZ→CIELAB conversion, color generation
- `src/lib/auth.ts` — User registration/login, leaderboard CRUD (localStorage)
- `src/lib/auth-context.tsx` — React auth context provider
- `src/lib/scores.ts` — Legacy local score storage (deprecated, use auth.ts)
- `src/lib/share.ts` — Web Share API / clipboard fallback
- `src/components/Game.tsx` — Main state machine (menu → memorize → recreate → results)
- `src/components/MenuScreen.tsx` — Solo/multiplayer mode selection, difficulty toggle
- `src/components/MemorizeScreen.tsx` — Full-screen color with timer, skip button
- `src/components/ColorPicker.tsx` — HSB sliders for color recreation
- `src/components/ResultsScreen.tsx` — Two-panel Your selection/Original cards, leaderboard submission

### Routes
- `/` — Main game
- `/login` — Sign in / Sign up
- `/leaderboard` — Scores with mode/difficulty filters
- `/scoring` — CIEDE2000 scoring explanation
- `/lab` — Design studies
- `/privacy` — Privacy policy
- `/sound` — Sound toggle
- `/game/[id]` — Multiplayer game

## Scoring
- CIEDE2000 Delta E for perceptual distance
- S-curve: `base = 10 / (1 + (dE / 25.25)^1.55)`
- Hue recovery (0.25) and hue penalty (0.15) adjustments
- Final score: 0-10 per color, 50 max

## Conventions
- Dark theme only (neutral-950 background)
- App name: "Coloured"
- Client components only (no SSR needed)
- Auth is localStorage-based (no server)

## Gotchas
- Tailwind v4 uses `@import "tailwindcss"` not `@tailwind` directives
- LSP errors about `next` module are false positives — app works fine
- `npm install` may fail on Windows due to file locking — kill node processes first
