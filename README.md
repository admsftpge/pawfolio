# Pawfolio 🐾

*Your finest felines, rated and adored.*

A small cat-rating app built with **Expo + React Native + TypeScript** against [TheCatApi](https://thecatapi.com). Upload your cats, browse them in a responsive grid, heart your favourites, and vote them up or down — with live scores.

Runs on iOS, Android, and web from one codebase.

## Screenshots

<!-- screenshots go here -->

## Quick start

You'll need Node 20+, npm, and a free CatApi key ([thecatapi.com](https://thecatapi.com) — emailed instantly).

```bash
npm install
cp .env.example .env.local   # then paste your API key in
npm start
```

Checks:

```bash
npm test          # jest unit tests
npx tsc --noEmit  # typecheck
npm run lint      # eslint
```

## Requirements mapping

| Requirement | Where |
|---|---|
| 1. Upload a cat image at `/upload` | `src/app/upload.tsx` → `POST /images/upload` (multipart), client-side validation, API errors surfaced verbatim, success returns to `/` |
| 2. List your uploads at `/` | `src/app/index.tsx` → responsive grid, max 4 columns, scales to 340px, images never stretched (`contentFit="cover"`) |
| 3. Favourite / unfavourite | Heart on each card → `POST /favourites` / `DELETE /favourites/:id`, optimistic toggle |
| 4. Vote up / down | Pill on each card → `POST /votes` with value ±1 |
| 5. Score per cat | Sum of vote values (ups − downs), computed client-side from `GET /votes` |

Beyond the spec: a **Favourites tab** (the same cats filtered to hearted ones) and **deleting uploads** (long-press a card → confirm → `DELETE /images/:id`, removed optimistically). Any favourites or votes left pointing at a deleted image are ignored by the join — a case the unit tests pin down.

## Architecture

```
screens (src/app)            – render state, fire callbacks; no business logic
  └─ hooks (src/hooks)       – React Query: caching, mutations, optimistic updates
      └─ data (src/data)     – buildCatCards: the pure client-side join
          └─ api (src/api)   – typed CatApi modules, zod-validated responses
              └─ client.ts   – one axios instance: auth header + sub_id interceptor
```

**The join.** TheCatApi has no "my cats with favourite status and score" endpoint - images, favourites, and votes are three flat lists. `buildCatCards` joins them by `image_id` (a LEFT JOIN + GROUP BY in TypeScript): each image gets `favouriteId` (null = not favourited; otherwise the handle needed to unfavourite) and `score` (sum of vote values). It's a pure function with no React or HTTP in it, which makes it the most heavily unit-tested code in the repo — zero-match defaults, orphaned rows, mixed votes.

**Identity without auth.** Favourites and votes are tied to the API key, which represents the whole account. To model a per-user app, every request carries a `sub_id` — a UUID generated once and persisted on-device (the same mechanism a multi-tenant backend uses with one upstream credential). The caveat: uninstalling the app regenerates the UUID and orphans previous uploads. Real durability needs real auth, which is out of scope here.

**Optimistic updates.** Hearts and votes update the UI instantly: snapshot the cache, apply the guess, roll back on error, reconcile with the server afterwards. The ceremony lives once in `useOptimisticListMutation`; each mutation declares only its API call and how to flip the cached list.

## Decisions & trade-offs

- **Vote semantics, discovered empirically.** TheCatApi *upserts* votes — one vote per user per image, latest wins (verified against the live API; two consecutive up-votes leave one row). The optimistic update mirrors that by replacing rather than appending. Consequence: in a single-user app each cat's score ranges −1/0/+1; the formula is identical to a multi-user deployment, just with a population of one.
- **Validation at both ends.** Files are checked client-side at pick time (JPEG/PNG, ≤10 MB) so doomed uploads never hit the network; server-side errors (including TheCatApi's cat-classifier rejections) are shown verbatim.
- **Zod at the boundary.** Responses are parsed against schemas that validate only the fields the app consumes — strict about what we rely on, tolerant of additions.
- **Votes are paginated exhaustively.** Vote rows are unbounded (every tap adds one), so the score would silently cap at the API's 100-row page limit without the page loop in `listAllVotes`.
- **Design tokens.** Components reference color roles (`accent`, `surface`, `border`…), never hex values — the amber palette (and its dark-mode variant) lives in one block in `src/constants/theme.ts`, and repainting the app is an edit to that block only.
- **Upload is platform-forked.** React Native's FormData takes a `{uri, name, type}` descriptor; browsers need a real Blob. `uploadImage` handles both so the web build genuinely works.

## Known limitations / future work

- **No vote retraction** — once you've voted, a cat can't return to score 0 (the API supports `DELETE /votes/:id`; a Reddit-style "tap your active vote to retract" is the natural extension, needing the join to also expose your current vote).
- **Delete is long-press only** — no visible affordance on the card (kept clutter-free); discoverability relies on this README and the accessibility hint.
- **Failed optimistic updates roll back silently** — a toast explaining *why* the heart snapped back would be kinder.
- **Image list caps at 100** — pagination matters less for a personal collection than for votes; noted as a TODO in `images.ts`.
- **Default Expo icon/splash** — branding stops at the runtime UI.

## Testing

The join — the one place with real logic — is covered by 7 unit tests (`src/data/cat-cards.test.ts`) via jest-expo: empty inputs, zero-match defaults, mixed-vote summing, per-cat independence, favourite attachment, and orphaned rows. UI and API layers are kept thin enough to verify by inspection and manual testing across iOS/Android/web.

## AI disclosure

This project was built collaboratively with **Claude Code**, per the brief's note on AI usage. The workflow was pair-programming: I drove the architecture and scope decisions, reviewed every line, pushed back on and redirected the design throughout (including rejecting over-engineered abstractions until they earned their place), and made all final calls on trade-offs. The AI accelerated implementation, API verification (live testing of TheCatApi's vote upsert behaviour, page limits, and error formats), and iteration speed on styling. Every commit was authored, reviewed, and GPG-signed by me.
