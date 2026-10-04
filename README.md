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

Open http://localhost:3011

## Notes

- Dev server port is **3011** (3000, 3005, 3007, 3008, 3009, 3010, 8000 and
  8400 are already taken by sibling apps).
- `npm run build` type-checks (`tsc -b`) and produces the production bundle.
- Dark theme throughout. No backend — all content is the local data model.
