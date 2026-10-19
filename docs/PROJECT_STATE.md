# Project state

_Last updated: 19-Oct-2026 — C19 parser fix (refresh-only Monitor sheets) in this change, PR to
follow; the September re-run that uses it is prepared and waits for the owner's C20 decision._

## Summary

The dashboard has been transferred from the outgoing owner to the Centricity Products team
(GitHub `productsteamcentricity`) and publishes from the new repository. Since the transfer, the
monthly tools and the page code were hardened (16–19-Oct-2026) and the September data was
re-applied once to correct inception dates and carry the source's risk-reliability flags; parity
counts are unchanged. A P1 data gap was found on 19-Oct-2026: 215 funds on four Monitor sheets the
parser skipped still show 30-Jun-2026 figures under the September label (`KNOWN_ISSUES.md` C19). The
code fix is in this change; publishing the refreshed September data waits for an owner decision
(C20). The next run is the **September-2026 Reckoner catch-up**
(`/monthly-update September 2026`) when the desk releases the "October 2026" Reckoner deck (data as
on 30-Sep), followed by the **October-2026 MF cycle** (`/monthly-update October 2026`) in mid-November.

## Data in force (as on)

| Domain | As on | Next due |
|---|---|---|
| MF performance (Regular + Direct), MF benchmarks | 30-Sep-2026, **except the Regular figures of 215 funds** on the four refresh-only Monitor sheets: 214 at 30-Jun-2026, 1 at 31-Jul-2026 (C19; fix prepared, not published) | Sep re-run after the C20 decision; then the Oct-2026 MF cycle |
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
exact inception (exceptions: `KNOWN_ISSUES.md` C16, the Regular record still carrying the Direct
plan's date, and one legacy "Mutual Funds" record). Detail: `docs/update-log/2026-09_Sep-2026.md`,
Run 2.

## Latest verification

`node tools/verify_page.js site` on 19-Oct-2026 at `main` `1e48781`, and again on the working tree
with the C19 change (on `main` `6dc08ef`): identical, unchanged from the handover figures, exits 0:

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

`npm test` with the C19 change: 3 of 3 test files pass (blocklib 28, dates 10,
parser_refresh_only 18). RISK_MATRIX entries with `fl`: 33. Browser checks of the corrections run
(19-Oct-2026): `H.riskFlagged` marks 33 of 1,088 entries; console clean (update log, Run 2); page
load with the C19 change clean. Full browser check list last run on 16-Oct-2026 (all 11 pass).

C19 change, Sep-2026 bake dry run on the working tree: `Updated 2127 schemes · as on 30th September
2026 · 19 rows not merged`; `GATE fund rows on unrecognised Monitor sheets: PASS (0)`; no WARN;
`CHECK MASTER MF/ETF funds on no sheet of this Monitor` 42; MASTER records carrying r1y 6,348 (6,339
live). The byte control and six-month check are in `KNOWN_ISSUES.md` C19.

## Release

| Item | Value |
|---|---|
| Repository | https://github.com/productsteamcentricity/Centricity-Proposal-Playbook (public) |
| Live URL | https://productsteamcentricity.github.io/Centricity-Proposal-Playbook/ |
| Baseline tag | `handover-baseline` (= upstream `72e1f1e`, sanitised) |
| Transfer PR / merge commit | PR #1 → merge `25e71a3` (16-Oct-2026); Actions run 38866042211 (verify + publish) succeeded |
| Latest merge | PR #16 → `6dc08ef` (19-Oct-2026, docs only). Last merge that changed `site/`: PR #15 → `1e48781`; Actions run 39217928070 (verify + publish) succeeded |
| Live status | 19-Oct-2026: the six deploy files and `robots.txt` on the live site equal `main` `1e48781` (SHA-256; PR #16 changed no file in `site/`); `Centricity_Risk_Matrix.js` returns 404 (archived, D78). The C19 change is not merged or live |

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
| #16 | `6dc08ef` | docs: the post-handover fixes recorded; the export prompt | — |
| this change (PR to follow) | — | page parser: four refresh-only Monitor sheets; `bake_month.js` not-merged list, WARN, CHECK and unrecognised-sheet gate; parser unit test | C19 (code), D80 |

Status of every inherited item: `docs/KNOWN_ISSUES.md`. Partly fixed and still open there: A7 (page
Direct uploader is a separate parser), A14, A19, A20, A22, A23, A24, A25 (only the stale
`.gitattributes` NUL comment is left), F2 (only the misnamed `clen` in `tools/lib/pptx.js:9`), F3,
plus new C16–C18, C20, C21 and A27, and C19 (code fixed, data not yet re-run).

## In progress / blockers

- **C19 (P1) — code fixed, data not yet published.** 215 funds on the four Monitor sheets the parser
  skipped (`Debt Oriented34`, `Solution Oriented,ETFs,FOFs`, `Solution Oriented - Childrens `,
  `Hybrid`) show 30-Jun-2026 figures (one July's) under the 30-Sep label. The parser fix (refresh-only
  sheets, D80) is in this change, PR to follow. The September re-run with it (bake →
  `fill_variant_analytics` → `rekey_sif_analytics` → `merge_expense_exitload`; exactly 215 MASTER
  records change) is prepared and **waits for the owner's C20 decision**; it is not published.
- **Owner decision pending — C20 (P1).** 12 JioBlackRock Regular records (and, after the re-run, the
  C16 G-Sec fund) carry the Direct plan's returns from before their Aug-2026 launch, and blank Monitor
  cells keep older debt stats (C19). Options: clear return periods longer than the fund's life, or
  keep them labelled. This blocks publishing the C19 re-run.
- **Owner decision pending — 8 renames.** `rename_schemes.js` (reading the Monitor's true dates)
  finds 8 renames in the Sep and Aug Monitors that it used to miss: HDFC Retirement Savings →
  Retirement (Hybrid-Debt Plan); four Kotak overseas FoFs, Omni → Active; two Axis FoFs, Active →
  Omni; Motilal Oswal Asset Allocation Passive FoF-Aggressive → Multi Asset Passive FoF (looks
  suspicious: confirm against the AMC notice). They are **not applied**. Their new names sit on the
  `Solution Oriented,ETFs,FOFs` and `Hybrid` sheets, so the old-name records keep older figures (seven
  equal the 30-Jun-2026 Monitor) and the bake lists the new names as `not in MASTER`. With the C19
  fix, once a rename is approved and applied, the next bake **does** refresh that record through the
  refresh-only path (by exact name; its MASTER class is kept). Decide before the October MF cycle's
  rename `--apply`. List: `docs/update-log/2026-09_Sep-2026.md`, Run 2.
- Desk inputs missing: PMS performance file, the October Reckoner deck, Fund Manager Data, PMS & AIF
  Analytics, analytics workbooks with SIFs (`KNOWN_ISSUES.md` B1–B6); why 4 unmatured Debt ETFs are
  absent from the Sep Monitor (C19).
- External: the outgoing owner's public repo still holds the unredacted spec in its history and its
  site still serves it and the old dashboard — the owner should coordinate retirement with the
  outgoing owner (`KNOWN_ISSUES.md` R1, R7).

## Next steps (in order)

1. Merge the C19 code change (branch → PR → `verify` → merge; page code only, no data block).
2. Owner: decide C20, then apply and publish the September re-run (C19) and record it in the Sep-2026
   update log as a new run.
3. Owner: confirm or reject the 8 renames (above).
4. September-2026 catch-up, when the "October 2026" Reckoner is released (the last was applied on
   28-Sep): drop the Reckoner deck, `PMS_Scheme_Performance` as on 30-Sep, `Fund Manager Data` as on
   30-Sep and the latest `PMS & AIF Analytics` into `00_INBOX`, then `/monthly-update September 2026`.
5. October-2026 MF cycle (data as on 31-Oct), around 13th–17th November: `/monthly-update October 2026`.
6. Owner decisions pending (no urgency): branch protection on `main`; whether to keep the repo public
   long-term; retirement of the old site; whether to move the git folder out of OneDrive
   (`KNOWN_ISSUES.md` R6 — a OneDrive sync blocked one write on 19-Oct-2026).
7. Improvement backlog (only on request): the partly fixed and open items in `KNOWN_ISSUES.md`.
