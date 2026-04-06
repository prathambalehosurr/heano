# 🎨 Coloured

> How accurate is your color memory? Find out.

A full-stack color memory game built with **Next.js 15**, **TypeScript**, **Tailwind v4**, and **Supabase**. We show you 5 colors — you recreate them from memory using HSB sliders. Powered by **CIEDE2000** perceptual distance scoring.

🔗 **[Play Live](https://coloured.vercel.app)**

---

## 🧠 What It Does

- **Solo Mode** — test your color recall with easy/hard difficulty
- **Multiplayer** — generate shareable game links, compete with friends
- **Daily Challenge** — same 5 colors for everyone, every day
- **Leaderboard** — global rankings with mode/difficulty filters
- **Auth** — email/password + Google + GitHub OAuth via Supabase
- **Scoring** — CIEDE2000 Delta E with hue recovery/penalty (0–10 per color, 50 max)

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 |
| **Auth** | Supabase Auth (email + OAuth) |
| **Database** | Supabase Postgres (RLS enabled) |
| **Deployment** | Vercel |
| **Analytics** | @vercel/analytics |

---

## 🚀 Quick Start

```bash
# 1. Clone & install
git clone https://github.com/prathambalehosurr/heano.git
cd heano
npm install

# 2. Set up env
cp .env.example .env.local
# fill in your Supabase URL + anon key

# 3. Run Supabase SQL migration
# → go to Supabase Dashboard → SQL Editor → paste the schema SQL

# 4. Dev
npm run dev
# → http://localhost:3000
```

### 🔑 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## 📐 Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Home (auth gate → Game)
│   ├── login/              # Email + OAuth sign in/up
│   ├── leaderboard/        # Global rankings w/ filters
│   ├── profile/            # User profile
│   ├── scoring/            # CIEDE2000 explanation
│   ├── lab/                # Design studies
│   ├── privacy/            # Privacy policy
│   ├── sound/              # Sound toggle
│   └── game/[id]/          # Multiplayer game route
├── components/
│   ├── Game.tsx            # State machine: menu → memorize → recreate → results
│   ├── MenuScreen.tsx      # Mode selection (solo/multi/daily)
│   ├── MemorizeScreen.tsx  # Full-screen color with countdown timer
│   ├── ColorPicker.tsx     # HSB sliders + 15s countdown per color
│   └── ResultsScreen.tsx   # Two-panel Your Selection vs Original cards
├── lib/
│   ├── game.ts             # CIEDE2000 scoring pipeline, HSB→RGB→XYZ→CIELAB
│   ├── auth-context.tsx    # Supabase auth provider (session + profile sync)
│   ├── supabase.ts         # Supabase client init
│   ├── database.ts         # Score CRUD, leaderboard queries, profile updates
│   └── share.ts            # Web Share API / clipboard fallback
```

### 🎯 Scoring Pipeline

```
HSB → RGB → XYZ → CIELAB → CIEDE2000 Delta E → S-Curve → Hue Recovery/Penalty → 0-10
```

- **S-Curve**: `base = 10 / (1 + (dE / 25.25)^1.55)`
- **Hue Recovery**: up to 25% of lost points if hue is within ~25°
- **Hue Penalty**: up to 15% deduction if hue is off by 30°+ (only on vivid colors)

---

## 🗄 Database Schema

Two tables in Supabase Postgres with Row Level Security:

**`profiles`** — user profiles (auto-created on signup via trigger)
```
id (uuid, PK) → references auth.users
name (text)
email (text)
avatar_url (text, nullable)
created_at (timestamptz)
```

**`scores`** — game scores
```
id (uuid, PK)
user_id (uuid, FK → profiles)
score (numeric)
mode (text) — solo | daily | multiplayer
difficulty (text) — easy | hard
color_results (jsonb) — per-color breakdown
created_at (timestamptz)
```

### Required Indexes
```sql
CREATE INDEX idx_scores_score_mode_difficulty ON scores(score DESC, mode, difficulty);
CREATE INDEX idx_scores_user_id_score ON scores(user_id, score DESC);
```

### RLS Policies
- Anyone can **read** profiles and scores
- Authenticated users can **insert** their own scores
- Users can **update** their own profile
- Profile auto-created via `handle_new_user()` trigger on auth signup

---

## 📦 Scripts

```bash
npm run dev      # dev server (localhost:3000)
npm run build    # production build
npm run start    # production server
npm run lint     # ESLint
```

---

## 🌐 Deploy

Push to `main` → auto-deploys on **Vercel**.

Make sure your Supabase project has these redirect URLs configured:
- `https://coloured.vercel.app/`
- `http://localhost:3000/`

And your `.env.local` has the production Supabase credentials.

---

## 🧪 Want to Contribute?

1. Fork it
2. Branch off `main`
3. Ship it
4. Open a PR

No complicated setup. If it runs locally, it ships.

---

**Built by [Pratham Balehosur](https://github.com/prathambalehosurr)** · v1.0.4
