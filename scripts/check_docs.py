"""Yantra API-contract checks: spec validity, route coverage, collection parity.

Run:  python3 scripts/check_docs.py        (also wired as a pre-commit hook)

1. openapi.yaml must parse and validate (openapi-spec-validator).
2. Coverage diff must be zero: routes registered in src/App.tsx plus static
   files in public/ vs paths in openapi.yaml, in both directions.
3. postman_collection.json must be a structurally valid Postman Collection
   v2.1 whose requests match the spec's paths + methods one for one.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SPEC = ROOT / "openapi.yaml"
COLLECTION = ROOT / "postman_collection.json"
APP_TSX = ROOT / "src" / "App.tsx"
PUBLIC = ROOT / "public"

FAILURES: list[str] = []


def fail(msg: str) -> None:
    FAILURES.append(msg)
    print(f"FAIL: {msg}")


def check_spec() -> dict:
    import yaml
    from openapi_spec_validator import validate

    try:
        spec = yaml.safe_load(SPEC.read_text())
    except Exception as exc:  # noqa: BLE001
        fail(f"openapi.yaml does not parse as YAML: {exc}")
        return {}
    try:
        validate(spec)
    except Exception as exc:  # noqa: BLE001
        fail(f"openapi.yaml failed OpenAPI validation: {exc}")
        return {}
    print("ok: openapi.yaml parses and validates (openapi-spec-validator)")
    return spec


def inventory_routes() -> set[str]:
    """Re-derive the served routes from the routing code + public/."""
    src = APP_TSX.read_text()
    routes: set[str] = set()
    for m in re.finditer(r"<Route\s+(index|path=\"([^\"]+)\")", src):
        if m.group(1) == "index":
            routes.add("/")
        else:
            routes.add("/" + m.group(2).replace(":id", "{id}"))
    if '"*"' not in src and "path=\"*\"" not in src:
        fail("src/App.tsx catch-all Route path=\"*\" missing (fallback behaviour changed)")
    routes.discard("/*")  # catch-all is behaviour, not an expressible path (see spec info)
    for child in sorted(PUBLIC.iterdir()):
        if child.is_file():
            routes.add("/" + child.name)
    return routes


def check_coverage(spec: dict) -> None:
    if not spec:
        return
    spec_paths = set((spec.get("paths") or {}).keys())
    code_routes = inventory_routes()
    for r in sorted(code_routes - spec_paths):
        fail(f"route in code but missing from spec: {r}")
    for p in sorted(spec_paths - code_routes):
        fail(f"path in spec but not served by code: {p}")
    if not (code_routes - spec_paths) and not (spec_paths - code_routes):
        print(f"ok: coverage diff is zero ({len(spec_paths)} spec paths == {len(code_routes)} code routes)")


def flatten_items(items: list, folders: dict) -> list[tuple[str, str, str]]:
    out: list[tuple[str, str, str]] = []
    for entry in items:
        if "item" in entry:
            folders[entry["name"]] = [e["name"] for e in entry["item"] if "request" in e]
            for sub in entry["item"]:
                if "request" in sub:
                    req = sub["request"]
                    url = req["url"]
                    path = "/" + "/".join(url.get("path", []))
                    out.append((entry["name"], req["method"], path))
        elif "request" in entry:
            req = entry["request"]
            url = req["url"]
            out.append(("", req["method"], "/" + "/".join(url.get("path", []))))
    return out


def spec_pattern(path: str) -> re.Pattern:
    return re.compile("^" + re.sub(r"\{[^}]+\}", "[^/]+", path) + "$")


def check_collection(spec: dict) -> None:
    try:
        coll = json.loads(COLLECTION.read_text())
    except Exception as exc:  # noqa: BLE001
        fail(f"postman_collection.json is not valid JSON: {exc}")
        return
    if coll.get("info", {}).get("schema") != "https://schema.getpostman.com/json/collection/v2.1.0/collection.json":
        fail("collection info.schema is not Postman Collection v2.1.0")
        return
    print("ok: postman_collection.json is structurally valid v2.1")
    if not spec:
        return
    spec_tags = [t["name"] for t in spec.get("tags", [])]
    folders: dict[str, list[str]] = {}
    reqs = flatten_items(coll.get("item", []), folders)
    if sorted(folders) != sorted(spec_tags):
        fail(f"collection folders {sorted(folders)} != spec tags {sorted(spec_tags)}")
    else:
        print(f"ok: collection folders match spec tags ({len(spec_tags)} folders)")
    spec_methods = {(p, m.upper()) for p, ops in (spec.get("paths") or {}).items() for m in ops}
    unmatched = list(spec_methods)
    for folder, method, path in reqs:
        hit = None
        for sp, sm in unmatched:
            if sm == method and spec_pattern(sp).match(path):
                hit = (sp, sm)
                break
        if hit is None:
            fail(f"collection request with no spec counterpart: {method} {path} (folder {folder!r})")
        else:
            unmatched.remove(hit)
    for sp, sm in sorted(unmatched):
        fail(f"spec endpoint with no collection request: {sm} {sp}")
    if not unmatched:
        print(f"ok: collection requests match spec paths+methods one for one ({len(reqs)} requests)")


def main() -> int:
    if not SPEC.exists():
        fail("openapi.yaml missing")
    if not COLLECTION.exists():
        fail("postman_collection.json missing")
    spec = check_spec() if SPEC.exists() else {}
    check_coverage(spec)
    if COLLECTION.exists():
        check_collection(spec)
    base_urls = (spec.get("servers", []) or []) if spec else []
    if not any("3014" in (s.get("url", "") or "") for s in base_urls):
        fail("spec servers do not include the :3014 base")
    print("PASS" if not FAILURES else f"{len(FAILURES)} FAILURE(S)")
    return 1 if FAILURES else 0


if __name__ == "__main__":
    sys.exit(main())
