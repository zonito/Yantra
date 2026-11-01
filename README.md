# Yantra (यन्त्र)

The living, interactive Kubera Wheel Pipeline Architecture. An animated,
multi-page walkthrough of the option-wheel decision pipeline — the daily
cadence (00:05 IV backfill → Sunday bottom scoop → 13:30 dimmer → 14:00
recommendations → Jev shadow → 14:30 finalize → human review), the scoring
machinery, the 29 guardrails, the quality model, the handoff contracts, the
five gaps, and the Jev shadow trial.

Facts come from the 4 Oct 2026 architecture runbook. Pipeline changes update
`src/data/pipeline.ts` first; the static snapshot in the Molang repo is
re-exported from the app.

## Prerequisites

- Node 20+

## Run it

```bash
git clone https://github.com/zonito/yantra.git
cd yantra
npm install
npm run dev
```

Open http://localhost:3014

The live instance runs under launchd (`com.zonito.yantra.dev`, Vite dev
server on port 3014 with `--host`, so it also answers on the tailnet).
Restart it with `launchctl kickstart -k gui/$(id -u)/com.zonito.yantra.dev`.

## Dev setup (hooks, checks, tests)

One step after `npm install` on a fresh clone:

```bash
pipx install pre-commit   # or: brew install pre-commit
pre-commit install
```

Hooks run hygiene checks, Prettier, ESLint, `tsc -b` type-checking and the
fast test lane on every commit. There is no commit-msg hook: history does
not follow Conventional Commits, so enforcing it would reject the repo's
own style.

```bash
npm test            # vitest — pipeline data-model tests (fast lane)
npm run lint        # eslint
npm run format      # prettier --write
npm run build       # tsc -b + production bundle
pre-commit run --all-files   # every hook over the whole tree
```

## Notes

- Dev server port is **3014** (sibling apps already hold 3000–3013, 8000 and
  8400 — Smriti 3011, Panchang 3012, Sadhana 3013).
- `npm run build` type-checks (`tsc -b`) and produces the production bundle.
- Dark theme throughout. No backend — all content is the local data model.
