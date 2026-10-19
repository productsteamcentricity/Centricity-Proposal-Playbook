# Centricity Proposal Playbook — instructions for Claude Code

**What it is.** The Centricity Investment Proposal Dashboard: a static, build-less React page the
Products team uses to build investment proposals for HNI / UHNI / Family Office clients (pick from
~7,700 instruments, allocate a corpus, export a branded PowerPoint and Excel). All data is embedded
in the page. The owner (Centricity Products team, GitHub `productsteamcentricity`) is the product
owner; you handle the technical execution, git and GitHub, testing and documentation.

**First, every session:** read [`docs/PROJECT_STATE.md`](docs/PROJECT_STATE.md) (where things stand)
and skim [`docs/README.md`](docs/README.md) (doc map). For a monthly refresh the owner types
`/monthly-update <Month YYYY>`; if they ask in plain words instead, Read
`.claude/skills/monthly-update/SKILL.md` and follow it step by step. Verify facts against the code,
not against documents.

## Repository map (the workspace folder IS the git repo)

| Path | What | Git |
|---|---|---|
| `site/` | **The dashboard = the six-file deploy set**: `index.html` + `Centricity_ExtraSlides.js`, `Centricity_PMS_AIF_Terms.js`, `Centricity_June_Refresh.js`, `Centricity_IRR_Offshore.js`, `Centricity_SIF_Refresh.js` (+ `robots.txt`). Published to GitHub Pages. | tracked |
| `tools/`, `tools/lib/` | Monthly Node tools (dry-run by default) + `build_risk_matrix.py`; shared libraries | tracked |
| `docs/` | PRD, operating manual (trap catalogue), architecture, process, decisions, state, issues, update logs | tracked |
| `.claude/` | `agents/` (8 specialists), `skills/` (`monthly-update`, `verify-dashboard`), `serve.js`, `launch.json` | tracked |
| `.github/workflows/pages.yml` | Parity gate on every PR, push to `main` and manual run; publishes `site/` from `main` | tracked |
| `monthly-updates/` | `00_INBOX/` (owner drops files) + one folder per data month | **local only** |
| `backups/`, `handover-archive/` | Pre-refresh snapshots; the handover zips as received | **local only** |

## Commands (from the repo root)

```bash
npm ci                                   # once per machine (xlsx 0.18.5 — must match the in-page SheetJS)
node tools/verify_page.js site           # true in-browser counts (npm run verify)
node .claude/serve.js                    # preview at http://127.0.0.1:8080/ (or preview_start "playbook")
node tools/<tool>.js …                   # dry-run; add --apply only after reading every gate
```
Three tools have no default target and need `--html site/index.html`: `merge_pms_performance.js`,
`pin_pms_alias.js`, `merge_reckoner.js`. Full tool index: [`tools/README.md`](tools/README.md).

## Rules that protect production (details: `docs/OPERATING_MANUAL.md` → Traps)

1. **A deploy is six files.** `index.html` alone silently reverts data. Sibling load order
   June → IRR/Offshore → SIF is load-bearing; siblings re-apply on every load, so data a sibling
   owns must be changed in the sibling (PRD §11.5).
2. **Never Read `site/index.html` whole** (12.8 MB, multi-MB lines). Use Grep `-o`/`-n`, Read with
   offset/limit, or Node `fs`. Never regex its data lines in PowerShell. Data blocks change only via
   `tools/lib/blocklib.js`. The file must end with `</body></html>`.
3. **Dry-run first, read the gates, back up** the six files to `backups/<date>_<tag>/` before `--apply`.
4. **Scale:** MASTER returns/IRR/expense are decimals (0.12 = 12%); analytics weights are percent;
   MF and SIF Monitor returns are always percent → ÷100, never auto-detect.
5. **Report, never guess** ambiguous matches (renames, PMS pins, Reckoner names, uploads). Ask the owner.
6. **No fabricated data** in client-facing output (no holdings fallback, MLD unrated → "Unrated").
7. **Rename before bake** (`tools/rename_schemes.js` first, every month). The Monitor decides spellings.
8. **Single predicates:** `H.isHybridScheme`, `H.isEquitySIF`, `H.isSelfDescribingDebt`,
   `H.creditBucket`. Deliberate oddities stay (`Mutual Funds` plural, hand-animated nav scroll,
   12 unclassified legacy SIF rows, dead code kept for parity).
9. **Invariants:** 0 duplicate MASTER names; Centricity Select keys in MASTER = total; top-10 Direct
   Equity by market cap are "Large Cap"; `DATA_DATES.sif` is not "—".

## How every change is made

1. Understand the request; investigate the code (use `repo-archaeologist`); for anything material,
   plan it (`principal-architect`; `financial-data-reviewer` if financial logic or data is touched).
2. Branch from `main`: `data/<YYYY-MM>`, `feat/…`, `fix/…`, `docs/…`, `chore/…`.
3. Smallest coherent change; no unrelated refactors (log them in `docs/KNOWN_ISSUES.md`).
4. Verify: `node tools/verify_page.js site` + the `verify-dashboard` skill (`qa-verifier`).
5. Update docs in the same branch: `CHANGELOG.md`, `docs/PROJECT_STATE.md`, and whatever the change
   made stale (`docs/DECISIONS.md` for decisions, `docs/KNOWN_ISSUES.md`).
6. Stage files explicitly, `security-reviewer` check, commit, push, `gh pr create`, wait for the
   `verify` check, merge (= publish), confirm the live files match `site/` (`release-manager`).
   Monthly refreshes auto-publish when every check passes (D61); other changes: merge when verified
   unless the owner asked to review first.

## Hosting and repositories

- `origin` → https://github.com/productsteamcentricity/Centricity-Proposal-Playbook (public; D60).
- Live: https://productsteamcentricity.github.io/Centricity-Proposal-Playbook/ (Actions → Pages from `site/`).
- `upstream` → the outgoing owner's repo (read-only reference; push disabled). History was migrated
  with client names redacted (tag `handover-baseline` = upstream `72e1f1e`).

## Never

- Commit `.xlsx/.pptx/.zip`, anything under `monthly-updates/`, `backups/`, `handover-archive/`, or
  any secret. Put client names or investor data in any file.
- Force-push, rewrite published history, change repo settings/visibility, or bypass a failing check
  without the owner's explicit instruction.
- Upgrade the CDN libraries or `xlsx` (pinned for parity), or "modernise"/restyle during data work.

## Headline state (update after every refresh; full detail in `docs/PROJECT_STATE.md`)

Data as on **30-Sep-2026** (performance, analytics, SIF, risk matrix), except 215 MF/ETF funds on
four Monitor sheets the parser skipped until 19-Oct-2026, still at 30-Jun-2026 until the September
re-run is published (KNOWN_ISSUES C19/C20); PMS/AIF performance and
Centricity Select **31-Aug-2026**; PMS/AIF look-through 31-Jul-2026; fund managers = the 30-Sep
Monitor's first-named manager only (the Sep bake replaced the 31-Aug roster). `verify_page`: MASTER 7,682 ·
Centricity Select 178 (178 in MASTER) · PMS 692 / AIF 12 / benchmarks 4 · RISK_MATRIX 1,088 ·
EQUITY_ANALYTICS 1,205 · 0 duplicates · 0 script errors. Next due: the Sep-2026 Reckoner catch-up ("October 2026" deck,
`/monthly-update September 2026`), then the Oct-2026 MF cycle (mid-November).
