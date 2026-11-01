# Yantra — agent notes

Static SPA (React + react-router, Vite on :3014). No backend — all content is
the local data model in `src/data/pipeline.ts`. Pipeline changes update that
file first.

## API documentation

`openapi.yaml` and `postman_collection.json` in the repo root are the API
contract of record for this app. They describe every HTTP endpoint Yantra
itself serves (the SPA shell paths plus `public/` static assets — there is no
backend, so every page path returns HTTP 200 `text/html` and routing happens
client-side).

- Any change that adds, removes or alters an endpoint (path, method,
  parameters, body, response, status codes, auth) must update BOTH files in
  the SAME change. A routes change without the spec and collection updated is
  an incomplete change.
- Validate before committing:
  - Spec: `openapi-spec-validator openapi.yaml` (must print `openapi.yaml: OK`)
  - Contract checks (coverage diff + collection parity):
    `python3 scripts/check_docs.py` (must print `PASS`)
- These checks run automatically at commit time via the `api-contract`
  pre-commit hook. A stale spec fails the commit.
- If a generator is later introduced to produce the spec from code, update
  this section in the same change to name the generator command instead of
  the hand-editing steps above.
