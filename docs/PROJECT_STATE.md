# Project state

_Last updated: 16-Oct-2026 — transfer baseline (Stage A) completed._

## Summary

The dashboard has been transferred from the outgoing owner to the Centricity Products team
(GitHub `productsteamcentricity`) with **no change to the product or its data**. The live site now
publishes from the new repository. The next run is the **September-2026 Reckoner catch-up**
(`/monthly-update September 2026`) when the desk releases the "October 2026" Reckoner deck (data as
on 30-Sep), followed by the **October-2026 MF cycle** (`/monthly-update October 2026`) in mid-November.

## Data in force (as on)

| Domain | As on | Next due |
|---|---|---|
| MF performance (Regular + Direct), MF benchmarks | 30-Sep-2026 | Oct-2026 MF cycle |
| Equity / Hybrid / Debt analytics | 30-Sep-2026 (SIF look-through from Aug) | Oct-2026 MF cycle |
| Listed Direct Equity universe + returns | 30-Sep-2026 | Oct-2026 MF cycle |
| Expense ratio, exit load | Sep-2026 | Oct-2026 MF cycle |
| SIF performance | 30-Sep-2026 | Oct-2026 MF cycle |
| Portfolio Matrix (risk ratios) | 30-Sep-2026 | Oct-2026 MF cycle |
| Market Update slides | October-2026 deck (September outlook) | next Outlook deck |
| Fund managers (internal: search box and Master Editor only) | 30-Sep Monitor, first-named manager only (the Sep bake replaced the 31-Aug full-team roster) | **behind** — needs `Fund Manager Data` as on 30-Sep or later, applied after the bake (step 9) |
| PMS performance, AIF performance, Centricity Select | 31-Aug-2026 (September-2026 Reckoner) | **behind one cycle** — needs `PMS_Scheme_Performance` as on 30-Sep and the "October 2026" Reckoner deck (`/monthly-update September 2026`) |
| PMS/AIF look-through | 31-Jul-2026 | when `PMS & AIF Analytics` arrives |
| Invictus bonds / GIFT City & Offshore / SIF universe | 6-Aug-2026 / Jun–Jul-2026 / Jun-2026 list (28 schemes; 30 live in `var SIF`) | only when the desk sends new lists |

## Latest verification

`node tools/verify_page.js site` on 16-Oct-2026 (identical to the outgoing owner's handover figures):

```
MASTER effective          7682
CENTRICITY_SELECT         178   (keys present in MASTER: 178)
  with rationale          133
  with risk ratios        46
  with details            51
PMS_PERFORMANCE.pms       692
PMS_PERFORMANCE.aif       12
PMS_PERFORMANCE.benchmark 4
PMS_PERF_ALIAS            27   (null pins: 4)
EQUITY_ANALYTICS          1205
RISK_MATRIX               1088
PMS_AIF_TERMS             73
EXTRA_SLIDES              6
DATA_DATES                {"performance":"30th September 2026","analytics":"30th September 2026","pms":"31st August 2026","sif":"30th September 2026","riskMatrix":"30 Sep 2026"}
duplicate MASTER names    0
file ends </html>         yes
MASTER PMS with perf      23 of 27
script errors (excluding the CDN globals): 0
```

Browser checks (local, 16-Oct-2026): all 11 checks in `TESTING.md` §3 pass. Live site (16-Oct-2026):
all 8 files byte-identical to `site/`; clean console, universe 7682, footer dates, Excel 13 sheets,
PowerPoint 25 slides with the logo on all 25.

## Release

| Item | Value |
|---|---|
| Repository | https://github.com/productsteamcentricity/Centricity-Proposal-Playbook (public) |
| Live URL | https://productsteamcentricity.github.io/Centricity-Proposal-Playbook/ |
| Baseline tag | `handover-baseline` (= upstream `72e1f1e`, sanitised) |
| Transfer PR / merge commit | PR #1 → merge `25e71a3` (16-Oct-2026); Actions run 38866042211 (verify + publish) succeeded |
| Live status | Published 16-Oct-2026; live files = `site/` (SHA-256 checked) |

## Completed (Stage A — replication and baseline)

- Inventory of all handover material; full re-extraction of the inputs zip (81 files; the earlier
  manual extraction had only 43 of them); verified integrity (six deploy files match PRD §2.3 hashes and the
  live production site byte for byte).
- Git history migrated (74 commits) with client names redacted from one spec; pushed to the new repo.
- Repository reorganised into `site/`, `tools/`, `docs/` with tool behaviour proven unchanged.
- Workspace organised: `monthly-updates/00_INBOX` + month folders, `backups/`, `handover-archive/`.
- Local preview hardened (serves `site/` on localhost only); CI parity gate + Pages publishing.
- Documentation set, 8 specialist agents, `/monthly-update` and `/verify-dashboard` skills.

## In progress / blockers

- None for the baseline.
- External: the outgoing owner's public repo still holds the unredacted spec in its history and its
  site still serves it and the old dashboard — the owner should coordinate retirement with the
  outgoing owner (`KNOWN_ISSUES.md` R1, R7).

## Next steps (in order)

1. September-2026 catch-up, when the "October 2026" Reckoner is released (the last was applied on
   28-Sep): drop the Reckoner deck, `PMS_Scheme_Performance` as on 30-Sep, `Fund Manager Data` as on
   30-Sep and the latest `PMS & AIF Analytics` into `00_INBOX`, then `/monthly-update September 2026`.
2. October-2026 MF cycle (data as on 31-Oct), around 13th–17th November: `/monthly-update October 2026`.
3. Owner decisions pending (no urgency): branch protection on `main`; whether to keep the repo public
   long-term; retirement of the old site; whether to move the git folder out of OneDrive
   (`KNOWN_ISSUES.md` R6).
4. Improvement backlog (Stage B, only on request): see `KNOWN_ISSUES.md` "suggested fix" entries.
