# Yantra — agent notes

Single source of truth for agents in this repo. Sibling instruction files, if
added later, keep only tool-specific notes and point here. Setup detail that
duplicates this file lives in [README.md](README.md); do not repeat it here.

## 1. What this app is

Yantra is the living, interactive walkthrough of the Kubera Wheel option-wheel
pipeline: the daily cadence, the Sutradhara scoring machinery, the 29
guardrails, the quality model, the eight handoff contracts, the five gaps, and
the Jev shadow trial. It is read by the pipeline's owner (and agents orienting
in the estate) to understand how the wheel decides before touching any live
engine. It decides nothing itself: it renders facts transcribed from the
4 Oct 2026 architecture runbook, held in the local data model.

## 2. Run, build, test, restart

Package manager is npm (`package-lock.json` is the only lockfile). Node 20+
(see [README.md](README.md)). Scripts are defined in `package.json`:

```bash
npm install           # install from package-lock.json
npm run dev           # Vite dev server on http://localhost:3014
npm run preview       # serve the production build, also on :3014
npm run build         # tsc -b && vite build -> dist/
npm test              # vitest run (fast lane, see §8)
npm run lint          # eslint .
npm run format        # prettier --write .
npm run format:check  # prettier --check .
pre-commit install    # once per clone, after pipx/brew install pre-commit
pre-commit run --all-files  # every hook over the whole tree
```

The live instance runs under launchd as `com.zonito.yantra.dev` (Vite with
`--host`, so it also answers on the tailnet). Restart it with
`launchctl kickstart -k gui/$(id -u)/com.zonito.yantra.dev`. That label and
command are recorded only in [README.md](README.md); there is no plist in this
repo.

Verify the app is up on new code, do not trust the port alone: `curl -s
http://localhost:3014/` must return HTTP 200 `text/html` whose body is the
current `index.html` shell, and a changed route must render the new content in
a browser. A 200 from :3014 served by an old process is the known failure
mode in §4, not proof.

## 3. Architecture map

- `index.html` — shell with `#root`; the only HTML file.
- `src/main.tsx` — entry: throws if `#root` is missing, renders `App` under
  `StrictMode`.
- `src/App.tsx` — `Root`: `BrowserRouter` + `Routes`. One index route, the
  dynamic `stage/:id` route, 17 named routes, and a `path="*"` catch-all that
  renders Home. This file is the route inventory `scripts/check_docs.py`
  re-derives.
- `src/components/Layout.tsx` — shell (header/nav, `RouteErrorBoundary`,
  `Breadcrumb`); its default export is confusingly named `App`. Also
  `Flow.tsx` (flow diagram, `OutputLink`), `ArchitectureDiagram.tsx`, and
  `SequenceDiagram.tsx`.
- `src/pages/` — 19 files: one page per route, plus `StagePage.tsx` for
  `stage/:id` (unknown id redirects to `/`). Pages hold no facts of their own;
  each imports its facts from the data model.
- `src/data/pipeline.ts` (~2,070 lines) — the entire content and the decision
  logic this app renders: `phases`/`PipelineNode` flow, `nodeOrder`,
  `observerNodeId`, `nodeById`/`phaseOfNode`/`nodeNeighbors` lookups, the
  eight `agentViews` weights, `rules1400`/`rules1430`, `handoffs`, `gaps`, and
  one `*Facts`/`*Routers` record per engine (Agni, Airavata, Kubera, Varuna,
  Drona, Vidhura) and satellite (Kamadhenu, Rashi, Bhisma).
- `src/data/pipeline.test.ts` — the only test file; pins the invariants in §4.
- `scripts/check_docs.py` — API-contract checker (see §8). `public/` holds
  only `favicon.svg`. `openapi.yaml` + `postman_collection.json` are the API
  contract of record (see §4).

Data flow: runbook facts → hand edit of `src/data/pipeline.ts` → pages render
it → `npm run build` emits `dist/`. There is no runtime inflow: no `fetch`, no
env vars, no backend. Downstream, the static snapshot in the Molang repo is
re-exported from this app, so a fact changed here propagates there on
re-export.

## 4. Behaviour contracts and invariants

- Pipeline changes update `src/data/pipeline.ts` first. Pages must not carry
  their own copies of facts; if a page needs a number, it comes from the data
  model.
- Estate discovery records: the `*Facts` exports (`repo`, `base`, `role`) are
  a discovery source for the whole estate — other work trusts them to find an
  app. Write or change an entry only after verifying it against that app
  itself (its repo, its live base). The file already models the honest states:
  Vidhura and Rashi record "documented from verified usage only" instead of a
  repo that was not found. Never promote such an entry, a port, or a base from
  hearsay, another app's docs, or a guess.
- Port 3014 is pinned with `strictPort: true` on both `server` and `preview`
  in `vite.config.ts`. Do not remove it and do not work around a collision by
  taking the next port: a silent hop once left a stale instance serving 3014
  while edits went to 3015 (`logs/` still shows a 3015 boot). If 3014 is
  occupied, find and stop the stale process or escalate; never just use 3015.
- Serving contract: no backend, so every page path is `GET` → HTTP 200
  `text/html` (the SPA shell); routing is client-side. Unknown paths hit the
  catch-all and render Home with 200, not 404. Unknown `stage/:id` redirects
  client-side to `/`. There are no non-GET endpoints, parameters, bodies, or
  auth on anything Yantra serves.
- API contract: `openapi.yaml` and `postman_collection.json` describe every
  endpoint above (20 paths today, including `/favicon.svg`). Any change that
  adds, removes, or alters a route in `src/App.tsx` or a file in `public/`
  updates BOTH files in the same change. A routes change without both is
  incomplete, and the `api-contract` pre-commit hook fails the commit.
- Data invariants, enforced by `src/data/pipeline.test.ts`: node ids are
  unique; every phase is non-empty; every `outputs[].to` resolves via
  `nodeById`; every node `link` names a route declared in `src/App.tsx` (keep
  the test's `KNOWN_ROUTES` mirror in sync when adding a route); the Jev
  observer node (`observerNodeId = 'jev'`, `observer: true`) stays outside
  `nodeOrder` and never touches the trade; `nodeNeighbors` pins the sequential
  chain. Changing any of these is a rendered-behaviour change, not a tidy-up.

## 5. Accuracy

- Figures are display strings transcribed from the runbook into
  `src/data/pipeline.ts` (weights like `'22%'`, prices, thresholds). There is
  no runtime arithmetic, rounding, currency conversion, or `Intl`/`toFixed`
  formatting anywhere in `src/` — the only parse is the test's `parseFloat`
  over the weight strings. Do not add computation to a page to "derive" a
  figure: correct the string at its source in the data model, with the runbook
  or the owning app as authority.
- Never invent or hardcode a figure into a display. A number with no runbook
  or verified upstream source does not ship; record the gap the way the model
  already does (for example a caveat entry) instead of filling it.
- Null/missing semantics: `AgentView.proposed: null` means no rebalance is
  pending; `nodeById` returns `undefined` for an unknown id; `FlowItem.to` is
  absent when there is no hand-off. For upstream coverage, missing never means
  low: Vidhura's partial coverage is recorded as unknown, not as a signal.
  Preserve that reading when editing facts.
- Verify a number two ways before shipping: recompute one case by hand (the
  test does this for the weights — 22+10+22+12+14+10+5+5 = 100) and cross-check
  the string against its upstream source (the runbook section or the owning
  app's live response), not against another page that copied it.

## 6. Freshness

Yantra has no cache, no fetch, and no TTL: its output is exactly as fresh as
the last edit of `src/data/pipeline.ts` plus the last build/deploy. "Fresh"
here means the data model still matches the 4 Oct 2026 runbook and any
estate facts re-verified since; there is no stale badge because there is no
runtime data to go stale — staleness is an editing failure, caught by review,
not by the UI. When a described system changes, update the model in the same
change (see §10).

Do not confuse that with the freshness machinery the content describes, which
belongs to the other apps: Sutradhara's per-agent clocks (1h–168h) and bounded
5-minute replan, the wheel screener's 1h TTL-guarded snapshot, Varuna's
cache envelope (`stale: true` is served rather than failing) and 60s
force-refresh cooldowns, Bhisma's 30-minute snapshot cache. Upstream quirks
that affect how facts must be stated: Kamadhenu envelopes carry `error: null`
alongside data (check `ok`, not key presence); Rashi covers 65 currencies, not
the quoted 138; Bhisma's published hit rates are inflated by counting sells as
wins; Vidhura covers only part of the universe. Quote the verified number,
with its caveat, every time.

## 7. Performance

- The heavy path is the bundle: every page is imported eagerly in
  `src/App.tsx` (no lazy loading) and all pages share the one ~2,070-line
  data model, animated with framer-motion. Keep `pipeline.ts` edits surgical;
  do not duplicate its data into pages, and do not add a second copy of a fact
  that must then be kept in sync.
- There is deliberately no runtime data fetching. Do not add per-row or
  per-page upstream calls, polling, or fan-out to the engines/satellites from
  this app: it would break the static contract in §4 and couple page loads to
  nine other services. Facts move by editing the data model, not by fetching.
- The described pipelines already model the discipline to mirror in any
  future code here: bounded work (Sutradhara plans at most 10 symbols FULL /
  5 LIGHT), cache-first reads, single-flight refresh with cooldown. Unbounded
  fan-out and blocking the request path are defects here, not trade-offs.
- `npm run build` (`tsc -b` + Vite) is the bundle check; the fast test lane
  has a 10s per-test timeout (`vitest.config.ts`) so a hung test fails fast.

## 8. Quality gates

Pre-commit (`.pre-commit-config.yaml`, runs on every commit): hygiene hooks
(trailing whitespace, end-of-file, YAML/JSON/TOML validity, merge conflicts,
added files over 500 KB), Prettier (`npx prettier --write`), ESLint on
`.ts`/`.tsx`, `tsc -b` typecheck, the fast Vitest lane (`npx vitest run`,
10s per-test timeout), and `api-contract` (`python3 scripts/check_docs.py`).
There is no commit-msg hook; history does not follow Conventional Commits.

```bash
openapi-spec-validator openapi.yaml   # must print: openapi.yaml: OK
python3 scripts/check_docs.py         # must print: PASS (spec + coverage + collection parity)
npm test                              # full suite: currently 10 tests in src/data/pipeline.test.ts
npm run lint && npm run build         # eslint clean; tsc -b + bundle succeeds
```

Green means all of the above pass on the whole tree
(`pre-commit run --all-files`), not only on changed files. If a generator is
later introduced for the spec, name its command here in the same change and
retire the hand-editing rule in §4.

Standing completeness for any change: proofread the complete diff against the
request, run the full suite, push to origin, restart the service (§2), and
verify live on the new code. A local-only commit is not done.

## 9. Carefulness

- Secrets: this app needs none — there are no env vars, tokens, or API keys in
  `src/`. Never commit one, never print one, and never put a real account
  identifier or live figure in docs or examples; use synthetic values.
- Never hand-edit generated or derived files: `dist/` and `node_modules/`
  (writers: `npm run build`, `npm install`), `package-lock.json` (writer:
  `npm install` — change `package.json` and regenerate), and the
  `node_modules/.tmp/*.tsbuildinfo` files (writer: `tsc -b`). `logs/` is
  gitignored runtime output, not source. `src/data/pipeline.ts` is the
  opposite: hand-edited source of truth, changed deliberately (see §4).
- `openapi.yaml` and `postman_collection.json` are hand-maintained contract
  files today: edit them deliberately and together (§4), never regenerate one
  side from the other by hand-diffing.
- Needs the owner's explicit go-ahead: pushing to origin, restarting the
  launchd service, changing any estate record (port, repo, base) in the
  `*Facts` exports, and removing the `strictPort` pin. Documentation-only
  changes need no restart; state that instead of restarting anyway.

## 10. Keeping this file true

Update this file in the same change whenever a command, script, port,
architecture boundary, contract, invariant, or data flow changes. Delete stale
guidance; never leave a superseded line standing next to its replacement.
Every command named here must trace to `package.json`, `.pre-commit-config.yaml`,
`vite.config.ts`, `vitest.config.ts`, or [README.md](README.md), and every
path named here must exist. If this file and the code disagree, the code is
right and this file is the bug.
