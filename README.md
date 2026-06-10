# Pawfolio 🐾

*Your finest felines, rated and adored.*

A small cat-rating app built with **Expo + React Native + TypeScript** against [TheCatApi](https://thecatapi.com). Upload your cats, browse them in a responsive grid, heart your favourites, and vote them up or down — with live scores.

Runs on iOS, Android, and web from one codebase.

## Screenshots

<p>
  <img src="screenshots/home-grid.jpg" width="200" alt="Home grid with hearts and vote scores" />
  <img src="screenshots/home-list.jpg" width="200" alt="List view" />
  <img src="screenshots/upload.jpg" width="200" alt="Upload with preview" />
  <img src="screenshots/favourites.jpg" width="200" alt="Favourites tab" />
</p>

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
| 1. Upload a cat image at `/upload` | `src/app/upload.tsx` → normalise to JPEG → `POST /images/upload` (multipart), API errors surfaced verbatim, success returns to `/` |
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

**Ownership without auth.** Uploads and favourites are tied to the API key (the whole account), so to model "*my* cats / *my* favourites" every ownership request carries a `sub_id` — a UUID generated once and persisted on-device (the same mechanism a multi-tenant backend uses with one upstream credential). Votes are deliberately *not* scoped (see Decisions). The caveat: uninstalling regenerates the UUID and orphans previous uploads; real durability needs real auth, out of scope here.

**Optimistic updates.** Hearts and votes update the UI instantly: snapshot the cache, apply the guess, roll back on error, reconcile with the server afterwards. The ceremony lives once in `useOptimisticListMutation`; each mutation declares only its API call and how to flip the cached list.

## Decisions & trade-offs

- **Votes accumulate, by design.** This is a playful rating toy, not a ballot — so votes aren't scoped per user. The API upserts one vote per `sub_id`, so each tap sends a *unique* `sub_id` and is kept as its own row; the score is the aggregate of all of them. You can rate a cat up to whatever, or down. A production app would authenticate users and enforce one vote each — that one-vote-per-user model was a deliberate non-goal for a casual app (and the live API behaviour was verified by test).
- **Normalise, don't gatekeep.** TheCatApi only accepts JPEG/PNG and rejects HEIC — which is *every* iPhone photo (verified against the live API). Rather than reject the user's photo, every pick is transcoded to a right-sized JPEG via `expo-image-manipulator` before upload (downscaled to 2048px), so HEIC and oversized images just work. A light client-side size guard remains, and server-side errors (including TheCatApi's cat-classifier rejections) are shown verbatim.
- **The heart locks during its round-trip; votes don't.** Both update optimistically, but a favourite is a toggle of one server row whose delete needs the id the create returns — so the button disables (~300ms) while in flight rather than risking a delete with an unknown id. Votes are independent appends, so rapid taps are safe and unguarded. Making the heart rapid-toggle-safe would mean queuing deletes behind in-flight creates — deliberately skipped as over-engineering for a single-tap interaction.
- **Zod at the boundary.** Responses are parsed against schemas that validate only the fields the app consumes — strict about what we rely on, tolerant of additions.
- **Votes are paginated exhaustively.** Vote rows are unbounded (every tap adds one), so the score would silently cap at the API's 100-row page limit without the page loop in `listAllVotes`.
- **Design tokens.** Components reference color roles (`accent`, `surface`, `border`…), never hex values — the amber palette (and its dark-mode variant) lives in one block in `src/constants/theme.ts`, and repainting the app is an edit to that block only.
- **Upload is platform-forked.** React Native's FormData takes a `{uri, name, type}` descriptor; browsers need a real Blob. `uploadImage` handles both so the web build genuinely works.

## Known limitations / future work

- **Delete is long-press only** — no visible affordance on the card (kept clutter-free); discoverability relies on this README and the accessibility hint.
- **Uploads always re-encode** — every image is transcoded to JPEG, even one that's already a small JPEG (kept uniform for simplicity). A check to skip re-encoding when the pick is already a suitably-sized JPEG would save a little work.
- **Failed optimistic updates roll back silently** — a toast explaining *why* the heart snapped back would be kinder.
- **Image list caps at 100** — pagination matters less for a personal collection than for votes; noted as a TODO in `images.ts`.
- **Default Expo icon/splash** — branding stops at the runtime UI.

## Testing

The join — the one place with real logic — is covered by 7 unit tests (`src/data/cat-cards.test.ts`) via jest-expo: empty inputs, zero-match defaults, mixed-vote summing, per-cat independence, favourite attachment, and orphaned rows. UI and API layers are kept thin enough to verify by inspection and manual testing across iOS/Android/web.
