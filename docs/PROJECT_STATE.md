# Project state

_Last updated: 19-Oct-2026 — inherited tool and page fixes merged (PRs #3–#15); Sep-2026 data
corrected (true inception dates, 33 risk-reliability flags)._

## Summary

The dashboard has been transferred from the outgoing owner to the Centricity Products team
(GitHub `productsteamcentricity`) and publishes from the new repository. Since the transfer, the
monthly tools and the page code were hardened (16–19-Oct-2026) and the September data was
re-applied once to correct inception dates and carry the source's risk-reliability flags; parity
counts are unchanged. The next run is the **September-2026 Reckoner catch-up**
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
| Portfolio Matrix (risk ratios) | 30-Sep-2026; 33 funds carry the source's reliability flag (28 NAV split, 5 low correlation), shown with a dagger and footnote | Oct-2026 MF cycle |
| Market Update slides | October-2026 deck (September outlook) | next Outlook deck |
| Fund managers (internal: search box and Master Editor only) | 30-Sep Monitor, first-named manager only (the Sep bake replaced the 31-Aug full-team roster) | **behind** — needs `Fund Manager Data` as on 30-Sep or later, applied after the bake (step 9) |
| PMS performance, AIF performance, Centricity Select | 31-Aug-2026 (September-2026 Reckoner) | **behind one cycle** — needs `PMS_Scheme_Performance` as on 30-Sep and the "October 2026" Reckoner deck (`/monthly-update September 2026`) |
| PMS/AIF look-through (no page label; D70) | 31-Jul-2026 | when `PMS & AIF Analytics` arrives |
| Invictus bonds / GIFT City & Offshore / SIF universe | 6-Aug-2026 / Jun–Jul-2026 / Jun-2026 list (28 schemes; 30 live in `var SIF`) | only when the desk sends new lists |

Inception dates: corrected on 19-Oct-2026 (PR #13). 1,851 MASTER records and all 30 SIF rows moved
+1 day to the true date; 2,070 of the 2,072 Sep Monitor rows found in MASTER now carry the Monitor's
exact inception (exceptions: `KNOWN_ISSUES.md` C16 and one legacy "Mutual Funds" record). Detail:
`docs/update-log/2026-09_Sep-2026.md`, Run 2.

## Latest verification

`node tools/verify_page.js site` on 19-Oct-2026 at `main` `1e48781` (unchanged from the handover
figures; exits 0):

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

`npm test`: 2 of 2 test files pass (blocklib 28, dates 10). RISK_MATRIX entries with `fl`: 33.
Browser checks of the corrections run (19-Oct-2026): `H.riskFlagged` marks 33 of 1,088 entries;
console clean (update log, Run 2). Full browser check list last run on 16-Oct-2026 (all 11 pass).

## Release

| Item | Value |
|---|---|
| Repository | https://github.com/productsteamcentricity/Centricity-Proposal-Playbook (public) |
| Live URL | https://productsteamcentricity.github.io/Centricity-Proposal-Playbook/ |
| Baseline tag | `handover-baseline` (= upstream `72e1f1e`, sanitised) |
| Transfer PR / merge commit | PR #1 → merge `25e71a3` (16-Oct-2026); Actions run 38866042211 (verify + publish) succeeded |
| Latest merge | PR #15 → `1e48781` (19-Oct-2026); Actions run 39217928070 (verify + publish) succeeded |
| Live status | 19-Oct-2026: the six deploy files and `robots.txt` on the live site equal `main` `1e48781` (SHA-256); `Centricity_Risk_Matrix.js` returns 404 (archived, D78) |

## Completed (Stage A — replication and baseline)

- Inventory of all handover material; full re-extraction of the inputs zip (81 files; the earlier
  manual extraction had only 43 of them); verified integrity (six deploy files match PRD §2.3 hashes and the
  live production site byte for byte).
- Git history migrated (74 commits) with client names redacted from one spec; pushed to the new repo.
- Repository reorganised into `site/`, `tools/`, `docs/` with tool behaviour proven unchanged.
- Workspace organised: `monthly-updates/00_INBOX` + month folders, `backups/`, `handover-archive/`.
- Local preview hardened (serves `site/` on localhost only); CI parity gate + Pages publishing.
- Documentation set, 8 specialist agents, `/monthly-update` and `/verify-dashboard` skills.

## Fixes since the transfer (16–19-Oct-2026)

| PR | Merge | What | Issues / decisions |
|---|---|---|---|
| #3 | `3f3e4b5` | blocklib atomic writes and label helpers; `verify_page.js` exits 1 on a hard failure; unit tests; rehearsal harness | A8, A9, A23, A24 (part) |
| #4 | `1e4b2fc` | `merge_bond_list.js` needs `--desk`; refuses an ambiguous sheet | A1 |
| #5 | `4fbbad6` | `merge_pms_aif_analytics.js` no longer writes `DATA_DATES.analytics` | A3, D70 |
| #6 | `c93e55c` | `merge_reckoner.js` drop gates, `--accept-drops <n>` | A4, D71 |
| #7 | `0d4fca3` | MF chain: `isoDay`, `prev_names`, shared DIRECT_PERF builder, `npm test` in CI | A2, A5, A6, A7, A17, D72, D79 |
| #8 | `455a573` | DE universe / returns, expense, fund managers | A10–A14 |
| #9 | `71ecbe2` | risk matrix `fl`, SIF `--as-on` required, Python route guards | C3, A15, A16, A22 |
| #10 | `79e9759` | `tools/data/pins.json`; Reckoner fourth gate; PMS/AIF tools | A3, A4, A18–A20, A25, D75, D76 |
| #11 | `d260cdf` | bond list, slide and one-off tools | A1, A21, A26 |
| #12 | `792692d` | page: in-page `isoDay`, risk dagger and footnote, shared-link banner, SRI, `noindex`, favicon; risk-matrix file archived | A5, A6, C3, C13, C14, R2, R3, R5, E4, F3, D77, D78 |
| #13 | `10cb44c` | Sep-2026 data corrections (inception +1 day; 33 risk flags) | A6, C3 |
| #14 | `cd6317c` | `rename_schemes.js` compares the exact inception day | A6, D73 |
| #15 | `1e48781` | strict CLI finished (a stray word or a value flag without a value exits 2 in the six MF-chain tools too); last literal no-break spaces escaped; unused `fs` dropped from `merge_reckoner.js` | A25, F2, D72 |

Status of every inherited item: `docs/KNOWN_ISSUES.md`. Partly fixed and still open there: A7 (page
Direct uploader is a separate parser), A14, A19, A20, A22, A23, A24, A25 (only the stale
`.gitattributes` NUL comment is left), F2 (only the misnamed `clen` in `tools/lib/pptx.js:9`), F3,
plus new C16–C18.

## In progress / blockers

- **Owner decision pending — 8 renames.** `rename_schemes.js` (reading the Monitor's true dates)
  finds 8 renames in the Sep and Aug Monitors that it used to miss: HDFC Retirement Savings →
  Retirement (Hybrid-Debt Plan); four Kotak overseas FoFs, Omni → Active; two Axis FoFs, Active →
  Omni; Motilal Oswal Asset Allocation Passive FoF-Aggressive → Multi Asset Passive FoF (looks
  suspicious: confirm against the AMC notice). They are **not applied**. The 8 records do **not**
  carry September's numbers: their Monitor rows sit on the `Solution Oriented,ETFs,FOFs` and `Hybrid`
  sheets, which the parser's `SHEET_MAP` does not map (`docs/INPUT_FILES.md`), so they keep older
  figures (seven equal the 30-Jun-2026 Monitor). Applying the renames changes only the displayed
  name; it does not refresh their figures. Decide before the October MF cycle's rename `--apply`,
  The unmapped sheets themselves are KNOWN_ISSUES **C19 (P1)**: 225 funds there carry 30-Jun-2026
  figures under the 30-Sep label; the fix is the next change. List:
  `docs/update-log/2026-09_Sep-2026.md`, Run 2.
- Desk inputs missing: PMS performance file, the October Reckoner deck, Fund Manager Data, PMS & AIF
  Analytics, analytics workbooks with SIFs (`KNOWN_ISSUES.md` B1–B6); the JioBlackRock inception
  conflict (C16).
- External: the outgoing owner's public repo still holds the unredacted spec in its history and its
  site still serves it and the old dashboard — the owner should coordinate retirement with the
  outgoing owner (`KNOWN_ISSUES.md` R1, R7).

## Next steps (in order)

1. Owner: confirm or reject the 8 renames (above).
2. September-2026 catch-up, when the "October 2026" Reckoner is released (the last was applied on
   28-Sep): drop the Reckoner deck, `PMS_Scheme_Performance` as on 30-Sep, `Fund Manager Data` as on
   30-Sep and the latest `PMS & AIF Analytics` into `00_INBOX`, then `/monthly-update September 2026`.
3. October-2026 MF cycle (data as on 31-Oct), around 13th–17th November: `/monthly-update October 2026`.
4. Owner decisions pending (no urgency): branch protection on `main`; whether to keep the repo public
   long-term; retirement of the old site; whether to move the git folder out of OneDrive
   (`KNOWN_ISSUES.md` R6 — a OneDrive sync blocked one write on 19-Oct-2026).
5. Improvement backlog (only on request): the partly fixed and open items in `KNOWN_ISSUES.md`.
